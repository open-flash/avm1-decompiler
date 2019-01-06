import { Action } from "avm1-tree";
import { PartialExpr } from "../partial-expr";
import { Cfg } from "./cfg";

export type Edge =
  ActionEdge
  | ConditionalEdge
  | ExpressionEdge
  | IfFalseEdge
  | IfTestEdge
  | IfTrueEdge
  | MarkerEdge
  | SimpleEdge
  | SubCfgEdge;

export enum EdgeType {
  Action,
  Conditional,
  Expression,
  IfFalse,
  IfTest,
  IfTrue,
  Marker,
  Simple,
  Sub,
}

export interface ActionEdge<A extends Action = Action> {
  readonly type: EdgeType.Action;
  readonly action: A;
}

export interface ExpressionEdge {
  readonly type: EdgeType.Expression;
  readonly expression: PartialExpr;
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

export interface MarkerEdge {
  readonly type: EdgeType.Marker;
  readonly marker: Marker;
}

export interface SimpleEdge {
  readonly type: EdgeType.Simple;
}

export interface SubCfgEdge {
  readonly type: EdgeType.Sub;
}

export interface ConditionalEdge {
  readonly type: EdgeType.Conditional;
  readonly ifTrue: Cfg;
  readonly ifFalse: Cfg;
}

export type Marker = VariableDefinitionMarker;

export interface VariableDefinitionMarker {
  tag: "variable-definition";
  name: string;
}
