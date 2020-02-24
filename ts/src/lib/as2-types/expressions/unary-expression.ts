import { UnaryOperator } from "../../as2-tree/unary-operator";
import { Expression } from "../expression";

export interface UnaryExpression<L = null> {
  type: "UnaryExpression";
  loc: L;
  operator: UnaryOperator;
  argument: Expression<L>;
}
