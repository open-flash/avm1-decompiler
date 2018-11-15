import { CP_STATE_ANY, CpState } from "../constant-pool";
import { Edge, EdgeType, SimpleEdge } from "./edge";
import { BoundEdge, Node, NodeType, SimpleNode } from "./node";

// Control flow graph
export class Cfg {
  public readonly inConstants: CpState;

  private readonly source: SimpleNode;
  private readonly inEdges: Map<Node, Map<Node, Edge>>;

  constructor(source: SimpleNode) {
    const inEdges: Map<Node, Map<Node, Edge>> = new Map();
    const closedSet: Set<Node> = new Set();
    const openSet: Node[] = [source];
    while (openSet.length > 0) {
      const from: Node = openSet.pop()!;
      closedSet.add(from);
      for (const {to, edge} of this.getOutEdges(from)) {
        if (!closedSet.has(to)) {
          openSet.push(to);
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
    if (inEdges === undefined) {
      return;
    }
    for (const [from, edge] of inEdges) {
      yield {from, to, edge};
    }
  }

  * iterEdges(): IterableIterator<BoundEdge> {
    const closedSet: Set<Node> = new Set();
    const openSet: Node[] = [this.source];
    while (openSet.length > 0) {
      const from: Node = openSet.pop()!;
      closedSet.add(from);
      for (const outEdge of this.getOutEdges(from)) {
        if (!closedSet.has(outEdge.to)) {
          openSet.push(outEdge.to);
        }
        yield outEdge;
      }
    }
  }

  * iterNodes(): IterableIterator<Node> {
    const closedSet: Set<Node> = new Set();
    const openSet: Node[] = [this.source];
    while (openSet.length > 0) {
      const from: Node = openSet.pop()!;
      closedSet.add(from);
      yield from;
      for (const {to} of this.getOutEdges(from)) {
        if (!closedSet.has(to)) {
          openSet.push(to);
        }
      }
    }
  }

  public replaceOutEdge(from: SimpleNode, edges: ReadonlyArray<Edge>): void {
    const to: Node = from.out.to;
    this.unsetInEdge(from, to);
    if (edges.length === 0) {
      const edge: SimpleEdge = {type: EdgeType.Simple};
      from.out = {to, edge};
      this.setInEdge(from, to, edge);
      return;
    }
    let curTo: Node = to;
    for (let i: number = edges.length - 1; i >= 0; i--) {
      const edge: Edge = edges[i];
      if (i === 0) {
        from.out = {to: curTo, edge};
        this.setInEdge(from, curTo, edge);
      } else {
        const from: SimpleNode = {
          type: NodeType.Simple,
          out: {to: curTo, edge},
        };
        this.setInEdge(from, curTo, edge);
        curTo = from;
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
}

function* getOutEdges(from: Node): IterableIterator<BoundEdge> {
  switch (from.type) {
    case NodeType.If:
      yield {from, ...from.outTrue};
      yield {from, ...from.outFalse};
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
