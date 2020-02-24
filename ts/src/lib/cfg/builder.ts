import { Avm1Parser } from "avm1-parser";
import { ActionType } from "avm1-types/action-type";
import { Action } from "avm1-types/raw/action";
import { Cfg } from "./cfg";
import { ActionEdge, Edge, EdgeType, IfFalseEdge, IfTestEdge, IfTrueEdge, SimpleEdge } from "./edge";
import { EndNode, IfNode, Node, NodeBase, NodeType, SimpleNode } from "./node";

// tslint:disable:no-use-before-declare

export function buildCfgFromAvm1(avm1: Uint8Array): Cfg {
  const cfg: CfgBuilder = new CfgBuilder();
  const source: BuilderNode = cfg.getSource();
  const avm1Parser: Avm1Parser = new Avm1Parser(avm1);
  const offsetToNode: Map<number, BuilderSimpleNode> = new Map([[0, source]]);
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

  return cfg.build();
}

export function buildLinear(edges: ReadonlyArray<Edge>): Cfg {
  const cfg: CfgBuilder = new CfgBuilder();
  let cur: IncompleteSimpleNode = cfg.getSource();
  for (const edge of edges) {
    cur = cfg.appendEdge(cur, edge);
  }
  cfg.appendEnd(cur);
  return cfg.build();
}

// Control flow graph builder
export class CfgBuilder {
  private readonly source: BuilderSimpleNode;
  // private readonly inEdges: Map<Node, Map<Node, Edge>>;

  constructor() {
    // this.inEdges = new Map();
    this.source = createSimpleNode() as any as SimpleNode;
  }

  build(): Cfg {
    return new Cfg(this.source as SimpleNode);
  }

  addSimpleEdge(from: IncompleteSimpleNode, to: BuilderNode): void {
    const edge: SimpleEdge = {type: EdgeType.Simple};
    (from as any).out = {to, edge};
  }

  appendActionEdge(from: IncompleteSimpleNode, action: Action): IncompleteSimpleNode {
    const edge: ActionEdge = {type: EdgeType.Action, action};
    return this.appendEdge(from, edge);
  }

  appendEnd(from: IncompleteSimpleNode): EndNode {
    const endNode: EndNode = {type: NodeType.End};
    const edge: SimpleEdge = {type: EdgeType.Simple};
    (from as any).out = {to: endNode, edge};
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

    return [ifFalseNode, ifTrueNode];
  }

  getSource(): BuilderSimpleNode {
    return this.source;
  }

  appendEdge(from: IncompleteSimpleNode, edge: Edge): IncompleteSimpleNode {
    const to: IncompleteSimpleNode = createSimpleNode();
    (from as any).out = {to, edge};
    return to;
  }
}

export function createSimpleNode(): IncompleteSimpleNode {
  return {type: NodeType.Simple, out: undefined};
}

export interface IncompleteSimpleNode extends NodeBase {
  type: NodeType.Simple;
  out?: BuilderHalfBoundEdge;
}

export type BuilderSimpleNode = IncompleteSimpleNode | SimpleNode;
export type BuilderNode = IncompleteSimpleNode | Node;

export interface BuilderHalfBoundEdge<E extends Edge = Edge> {
  readonly to: BuilderNode;
  readonly edge: E;
}
