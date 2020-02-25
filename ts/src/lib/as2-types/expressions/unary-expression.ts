import { Expression } from "../expression";
import { UnaryOperator } from "../unary-operator";

export interface UnaryExpression<L = null> {
  type: "UnaryExpression";
  loc: L;
  operator: UnaryOperator;
  argument: Expression<L>;
}
