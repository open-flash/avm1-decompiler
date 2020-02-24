import { BinaryOperator } from "../binary-operator";
import { Expression } from "../expression";

export interface BinaryExpression<L = null> {
  type: "BinaryExpression";
  loc: L;
  operator: BinaryOperator;
  left: Expression<L>;
  right: Expression<L>;
}
