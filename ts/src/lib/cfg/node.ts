import { CpState } from "../disassembler/constant-pool";
import { Edge } from "./edge";

/**
 * Represents a node in the Control Flow Graph.
 *
 * Each node corresponds to a state in the VM.
 */
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

export interface SimpleNode extends NodeBase {
  type: NodeType.Simple;
  out: HalfBoundEdge;
}

export interface HalfBoundEdge<E extends Edge = Edge> {
  readonly to: Node;
  readonly edge: E;
}

export interface BoundEdge<E extends Edge = Edge> extends HalfBoundEdge<E> {
  readonly from: Node;
}
