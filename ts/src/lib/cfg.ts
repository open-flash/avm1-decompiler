import { Avm1Parser } from "avm1-parser";
import { Action, ActionType } from "avm1-tree";
import { PartialExpr } from "./partial-expr";
import { CpState } from "./constant-pool";

export interface HalfBoundEdge<E extends Edge = Edge> {
  readonly to: Node;
  readonly edge: E;
}

export interface BoundEdge<E extends Edge = Edge> extends HalfBoundEdge<E> {
  readonly from: Node;
}

// Control flow graph
export class Cfg {
  public readonly parentConstantPool: ReadonlyArray<string>;

  private readonly source: SimpleNode;
  // private nodes: Set<number>;
  // private readonly nodes: Map<number, Node>;
  private readonly inEdges: Map<Node, Map<Node, Edge>>;

  private constructor() {
    this.inEdges = new Map();
    this.source = createSimpleNode() as any as SimpleNode;
    this.parentConstantPool = [];
  }

  public static fromAvm1(avm1: Uint8Array): Cfg {
    const cfg: Cfg = new Cfg();
    const source: SimpleNode = cfg.getSource();
    const avm1Parser: Avm1Parser = new Avm1Parser(avm1);
    const offsetToNode: Map<number, IncompleteSimpleNode | SimpleNode> = new Map([[0, source]]);
    const incompleteNodes: Set<IncompleteSimpleNode> = new Set([source as any]);
    const openSet: number[] = [0];
    while (openSet.length > 0) {
      const curOffset: number = openSet.pop()!;
      const curNode: IncompleteSimpleNode = offsetToNode.get(curOffset)! as IncompleteSimpleNode;
      // TODO: Assert `curNode.out` is undefined
      const action: Action | undefined = avm1Parser.readAt(curOffset);
      if (action === undefined) {
        continue;
      }
      switch (action.action) {
        case ActionType.If: {
          const [ifFalseNode, ifTrueNode] = cfg.appendIf(curNode);
          incompleteNodes.delete(curNode);
          const falseOffset: number = avm1Parser.getBytePos();
          const falseTarget: IncompleteSimpleNode | SimpleNode | undefined = offsetToNode.get(falseOffset);
          if (falseTarget === undefined) {
            openSet.push(falseOffset);
            offsetToNode.set(falseOffset, ifFalseNode);
            incompleteNodes.add(ifFalseNode);
          } else {
            cfg.addSimpleEdge(ifFalseNode, falseTarget as any);
            incompleteNodes.delete(ifFalseNode);
          }
          const trueOffset: number = falseOffset + action.offset;
          const trueTarget: IncompleteSimpleNode | SimpleNode | undefined = offsetToNode.get(trueOffset);
          if (trueTarget === undefined) {
            openSet.push(trueOffset);
            offsetToNode.set(trueOffset, ifTrueNode);
            incompleteNodes.add(ifTrueNode);
          } else {
            cfg.addSimpleEdge(ifTrueNode, trueTarget as any);
            incompleteNodes.delete(ifTrueNode);
          }
          break;
        }
        case ActionType.Jump: {
          const nextOffset: number = avm1Parser.getBytePos() + action.offset;
          const nextNode: IncompleteSimpleNode | SimpleNode | undefined = offsetToNode.get(nextOffset);
          if (nextNode === undefined) {
            openSet.push(nextOffset);
            const node: IncompleteSimpleNode = createSimpleNode();
            offsetToNode.set(nextOffset, node);
            incompleteNodes.add(node);
          } else {
            cfg.addSimpleEdge(curNode, nextNode as any);
            incompleteNodes.delete(curNode);
          }
          break;
        }
        default: {
          const nextNode: IncompleteSimpleNode = cfg.appendActionEdge(curNode, action);
          incompleteNodes.delete(curNode);
          const targetOffset: number = avm1Parser.getBytePos();
          const targetNode: IncompleteSimpleNode | SimpleNode | undefined = offsetToNode.get(targetOffset);
          if (targetNode === undefined) {
            openSet.push(targetOffset);
            offsetToNode.set(targetOffset, nextNode);
            incompleteNodes.add(nextNode);
          } else {
            cfg.addSimpleEdge(nextNode, targetNode as any);
            incompleteNodes.delete(nextNode);
          }
          break;
        }
      }
    }

    for (const incompleteNode of incompleteNodes) {
      cfg.appendEnd(incompleteNode);
    }

    return cfg;
  }

  addSimpleEdge(from: IncompleteSimpleNode, to: Node): void {
    const edge: SimpleEdge = {type: EdgeType.Simple};
    (from as any).out = {to, edge};
    this.setInEdge(from as any, to, edge);
  }

  appendActionEdge(from: IncompleteSimpleNode, action: Action): IncompleteSimpleNode {
    const edge: ActionEdge = {type: EdgeType.Action, action};
    return this.appendEdge(from, edge);
  }

  appendExpressionEdge(from: IncompleteSimpleNode, expression: PartialExpr): IncompleteSimpleNode {
    const edge: ExpressionEdge = {type: EdgeType.Expression, expression};
    return this.appendEdge(from, edge);
  }

  appendEnd(from: IncompleteSimpleNode): EndNode {
    const endNode: EndNode = {type: NodeType.End};
    const edge: SimpleEdge = {type: EdgeType.Simple};
    (from as any).out = {to: endNode, edge};
    this.setInEdge(from as any, endNode, edge);
    return endNode;
  }

  appendIf(from: IncompleteSimpleNode): [IncompleteSimpleNode, IncompleteSimpleNode] {
    const ifTrueEdge: IfTrueEdge = {type: EdgeType.IfTrue};
    const ifTrueNode: IncompleteSimpleNode = createSimpleNode();
    const ifFalseEdge: IfFalseEdge = {type: EdgeType.IfFalse};
    const ifFalseNode: IncompleteSimpleNode = createSimpleNode();

    const ifTestEdge: IfTestEdge = {type: EdgeType.IfTest};
    const ifNode: IfNode = {
      type: NodeType.If,
      outTrue: {to: ifTrueNode as any, edge: ifTrueEdge},
      outFalse: {to: ifFalseNode as any, edge: ifFalseEdge},
    };

    (from as any).out = {to: ifNode, edge: ifTestEdge};
    this.setInEdge(from as any, ifNode, ifTestEdge);
    this.setInEdge(ifNode, ifTrueNode as any, ifTrueEdge);
    this.setInEdge(ifNode, ifFalseNode as any, ifFalseEdge);

    return [ifFalseNode, ifTrueNode];
  }

  getSource(): SimpleNode {
    return this.source;
  }

  * getOutEdges(from: Node): IterableIterator<BoundEdge> {
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
      for (const outEdge of this.getOutEdges(from)) {
        if (!closedSet.has(outEdge.to)) {
          openSet.push(outEdge.to);
        }
        yield outEdge;
      }
      closedSet.add(from);
    }
  }

  * iterNodes(): IterableIterator<Node> {
    const closedSet: Set<Node> = new Set();
    const openSet: Node[] = [this.source];
    while (openSet.length > 0) {
      const from: Node = openSet.pop()!;
      yield from;
      for (const {to} of this.getOutEdges(from)) {
        if (!closedSet.has(to)) {
          openSet.push(to);
        }
      }
      closedSet.add(from);
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

  public appendEdge(from: IncompleteSimpleNode, edge: Edge): IncompleteSimpleNode {
    const to: IncompleteSimpleNode = createSimpleNode();
    (from as any).out = {to, edge};
    this.setInEdge(from as any, to as any, edge);
    return to;
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

export type Node = EndNode | IfNode | SimpleNode;

export enum NodeType {
  End,
  If,
  Simple,
}

export interface NodeBase {
  constants?: CpState;
  stack?: any;
}

export interface EndNode extends NodeBase {
  type: NodeType.End;
}

export interface IfNode extends NodeBase {
  type: NodeType.If;
  outTrue: HalfBoundEdge;
  outFalse: HalfBoundEdge;
}

function createSimpleNode(): IncompleteSimpleNode {
  return {type: NodeType.Simple, out: undefined};
}

export interface IncompleteSimpleNode extends NodeBase {
  type: NodeType.Simple;
  out: undefined;
}

export interface SimpleNode extends NodeBase {
  type: NodeType.Simple;
  out: HalfBoundEdge;
}

export type Edge = ActionEdge | ExpressionEdge | IfFalseEdge | IfTrueEdge | SimpleEdge | SubCfgEdge | IfTestEdge;

export enum EdgeType {
  Action,
  IfTrue,
  IfFalse,
  Expression,
  Simple,
  Sub,
  IfTest,
}

export interface SimpleEdge {
  readonly type: EdgeType.Simple;
}

export interface IfTrueEdge {
  readonly type: EdgeType.IfTrue;
}

export interface IfFalseEdge {
  readonly type: EdgeType.IfFalse;
}

/**
 * Represents an edge consuming the test of a `JumpIf` action.
 */
export interface IfTestEdge {
  readonly type: EdgeType.IfTest;
}

export interface ActionEdge<A extends Action = Action> {
  readonly type: EdgeType.Action;
  readonly action: A;
}

export interface SubCfgEdge {
  readonly type: EdgeType.Sub;
}

export interface ExpressionEdge {
  readonly type: EdgeType.Expression;
  readonly expression: PartialExpr;
}
