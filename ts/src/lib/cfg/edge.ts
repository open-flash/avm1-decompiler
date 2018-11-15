import { Action } from "avm1-tree";
import { PartialExpr } from "../partial-expr";

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
