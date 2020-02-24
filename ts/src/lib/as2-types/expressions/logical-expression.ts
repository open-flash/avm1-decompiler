import { Expression } from "../expression";
import { LogicalOperator } from "../logical-operator";

export interface LogicalExpression<L = null> {
  type: "LogicalExpression";
  loc: L;
  operator: LogicalOperator;
  left: Expression<L>;
  right: Expression<L>;
}
