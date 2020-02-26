import { Expression } from "../expression";
import { LogicalOperator } from "../logical-operator";

export interface LogicalExpression<L = unknown> {
  type: "LogicalExpression";
  loc: L;
  operator: LogicalOperator;
  left: Expression<L>;
  right: Expression<L>;
}

export interface RoLogicalExpression<L = unknown> {
  readonly type: "LogicalExpression";
  readonly loc: L;
  readonly operator: LogicalOperator;
  readonly left: Expression<L>;
  readonly right: Expression<L>;
}
