import { CP_STATE_ANY, CpState } from "../disassembler/constant-pool";
import { Edge, EdgeType, SimpleEdge } from "./edge";
import { BoundEdge, Node, NodeType, SimpleNode } from "./node";

export enum Traversal {
  PreorderDfs,
  PostorderDfs,
  ReversePostorderDfs,
}

// Control flow graph
export class Cfg {
  public readonly inConstants: CpState;

  private readonly source: SimpleNode;
  private readonly inEdges: Map<Node, Map<Node, Edge>>;

  constructor(source: SimpleNode) {
    const inEdges: Map<Node, Map<Node, Edge>> = new Map();
    // undefined: white, false: gray, true: black
    const visitedState: Map<Node, boolean> = new Map();
    const stack: Node[] = [source];
    while (stack.length > 0) {
      const from: Node = stack.pop()!;
      visitedState.set(from, true);
      for (const {to, edge} of this.getOutEdges(from)) {
        if (!visitedState.has(to)) {
          stack.push(to);
          visitedState.set(to, false);
        }
        let curInEdges: Map<Node, Edge> | undefined = inEdges.get(to);
        if (curInEdges === undefined) {
          curInEdges = new Map();
          inEdges.set(to, curInEdges);
        }
        curInEdges.set(from, edge);
      }
    }

    this.source = source;
    this.inEdges = inEdges;
    this.inConstants = CP_STATE_ANY;
  }

  getSource(): SimpleNode {
    return this.source;
  }

  * getOutEdges(from: Node): IterableIterator<BoundEdge> {
    yield* getOutEdges(from);
  }

  * getInEdges(to: Node): IterableIterator<BoundEdge> {
    const inEdges: Map<Node, Edge> | undefined = this.inEdges.get(to);
    if (inEdges !== undefined) {
      for (const [from, edge] of inEdges) {
        yield {from, to, edge};
      }
    }
  }

  getInDegree(to: Node): number {
    const inEdges: Map<Node, Edge> | undefined = this.inEdges.get(to);
    return inEdges === undefined ? 0 : inEdges.size;
  }

  * iterEdges(): IterableIterator<BoundEdge> {
    // undefined: white, false: gray, true: black
    const visitedState: Map<Node, boolean> = new Map();
    const stack: Node[] = [this.source];
    while (stack.length > 0) {
      const from: Node = stack.pop()!;
      visitedState.set(from, true);
      for (const outEdge of this.getOutEdges(from)) {
        if (!visitedState.has(outEdge.to)) {
          stack.push(outEdge.to);
          visitedState.set(outEdge.to, false);
        }
        yield outEdge;
      }
    }
  }

  * iterNodes(traversal: Traversal = Traversal.ReversePostorderDfs): IterableIterator<Node> {
    switch (traversal) {
      case Traversal.PreorderDfs:
        yield* this.iterNodesPreorder();
        break;
      case Traversal.PostorderDfs: {
        yield* this.iterNodesPostorder();
        break;
      }
      case Traversal.ReversePostorderDfs: {
        yield* [...this.iterNodesPostorder()].reverse();
        break;
      }
      default:
        throw new Error(`Unknown Traversal value: ${traversal}`);
    }
  }

  public* iterNodesPreorder(): IterableIterator<Node> {
    const stack: Node[] = [this.source];
    const known: Set<Node> = new Set(stack);
    while (stack.length > 0) {
      const from: Node = stack.pop()!;
      yield from;
      for (const {to} of [...this.getOutEdges(from)].reverse()) {
        if (!known.has(to)) {
          stack.push(to);
          known.add(to);
        }
      }
    }
  }

  public* iterNodesPostorder(): IterableIterator<Node> {
    const stack: Node[] = [this.source];
    const discoveredOutEdges: Map<Node, number> = new Map([[this.source, 0]]);
    while (stack.length > 0) {
      const from: Node = stack[stack.length - 1];
      let discovered: number = discoveredOutEdges.get(from)!;
      switch (from.type) {
        case NodeType.End: {
          yield stack.pop()!;
          break;
        }
        case NodeType.Simple: {
          if (discovered === 0) {
            const next: Node = from.out.to;
            discovered += 1;
            discoveredOutEdges.set(from, discovered);
            if (!discoveredOutEdges.has(next)) {
              discoveredOutEdges.set(next, 0);
              stack.push(next);
              continue;
            }
          }
          yield stack.pop()!;
          break;
        }
        case NodeType.If: {
          if (discovered === 0) {
            const next: Node = from.outTrue.to;
            discovered += 1;
            discoveredOutEdges.set(from, discovered);
            if (!discoveredOutEdges.has(next)) {
              discoveredOutEdges.set(next, 0);
              stack.push(next);
              continue;
            }
          }
          if (discovered === 1) {
            const next: Node = from.outFalse.to;
            discovered += 1;
            discoveredOutEdges.set(from, discovered);
            if (!discoveredOutEdges.has(next)) {
              discoveredOutEdges.set(next, 0);
              stack.push(next);
              continue;
            }
          }
          yield stack.pop()!;
          break;
        }
        default:
          throw new Error(`Unexpected NodeType value: ${(from as any).type}`);
      }
    }
  }

  public replaceOutEdge(from: SimpleNode, edges: ReadonlyArray<Edge>): void {
    const to: Node = from.out.to;
    this.unsetInEdge(from, to);
    this.addEdges(from, to, edges);
  }

  /**
   * Replaces local nodes between `from` and `to`.
   *
   * @param src Inclusive lower bound
   * @param dest Exclusive upper bound
   * @param edges Edges to add
   */
  public replaceInterval(src: SimpleNode, dest: Node, edges: ReadonlyArray<Edge>): void {
    this.emptyInterval(src, dest);
    this.addEdges(src, dest, edges);
  }

  public replaceChain(chain: ReadonlyArray<SimpleNode>, edges: ReadonlyArray<Edge>): void {
    if (chain.length === 0) {
      throw new Error("EmptyChain");
    } else if (chain.length === 1) {
      this.replaceOutEdge(chain[0], edges);
    }
    let prev: Node = chain[0];
    for (let i: number = 1; i < chain.length; i++) {
      const cur: Node = chain[i];
      if (cur === this.source || this.getInDegree(cur) !== 1 || prev.out.to !== cur) {
        throw new Error("InvalidChain");
      }
      prev = cur;
    }
    this.uncheckedReplaceChain(chain, edges);
  }

  private uncheckedReplaceChain(chain: ReadonlyArray<SimpleNode>, edges: ReadonlyArray<Edge>): void {
    for (const link of chain) {
      this.unsetInEdge(link, link.out.to);
    }
    const chainSrc: SimpleNode = chain[0];
    const chainDest: Node = chain[chain.length - 1].out.to;
    this.addEdges(chainSrc, chainDest, edges);
  }

  private addEdges(src: SimpleNode, dest: Node, edges: ReadonlyArray<Edge>): void {
    if (edges.length === 0) {
      const edge: SimpleEdge = {type: EdgeType.Simple};
      src.out = {to: dest, edge};
      this.setInEdge(src, dest, edge);
      return;
    }
    let curDest: Node = dest;
    for (let i: number = edges.length - 1; i >= 0; i--) {
      const edge: Edge = edges[i];
      if (i === 0) {
        src.out = {to: curDest, edge};
        this.setInEdge(src, curDest, edge);
      } else {
        const src: SimpleNode = {
          type: NodeType.Simple,
          out: {to: curDest, edge},
        };
        this.setInEdge(src, curDest, edge);
        curDest = src;
      }
    }
  }

  private setInEdge(from: Node, to: Node, edge: Edge): void {
    let inEdges: Map<Node, Edge> | undefined = this.inEdges.get(to);
    if (inEdges === undefined) {
      inEdges = new Map();
      this.inEdges.set(to, inEdges);
    }
    inEdges.set(from, edge);
  }

  private unsetInEdge(from: Node, to: Node): void {
    const inEdges: Map<Node, Edge> | undefined = this.inEdges.get(to);
    if (inEdges !== undefined) {
      inEdges.delete(from);
    }
  }

  private emptyInterval(src: SimpleNode, dest: Node): void {
    const inEdges: Set<BoundEdge> = new Set();
    const outEdges: Set<BoundEdge> = new Set();
    const stack: Node[] = [src];
    const known: Set<Node> = new Set([dest, dest]);
    while (stack.length > 0) {
      const node: Node = stack.pop()!;
      for (const outEdge of this.getOutEdges(node)) {
        outEdges.add(outEdge);
        if (!known.has(outEdge.to)) {
          stack.push(outEdge.to);
          known.add(outEdge.to);
        }
      }
      if (node !== src) {
        for (const inEdge of this.getInEdges(node)) {
          inEdges.add(inEdge);
        }
      }
    }
    // TODO: Check that `inEdges` is a subset of `outEdges`.
    for (const {from, to} of outEdges) {
      this.unsetInEdge(from, to);
    }
  }
}

function* getOutEdges(from: Node): IterableIterator<BoundEdge> {
  switch (from.type) {
    case NodeType.If:
      yield {from, ...from.outFalse};
      yield {from, ...from.outTrue};
      break;
    case NodeType.Simple:
      yield {from, ...from.out};
      break;
    case NodeType.End:
      break;
    default:
      throw new Error(`Unexpected NodeType value: ${(from as any).type}`);
  }
}
