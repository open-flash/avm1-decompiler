import { BinaryOperator } from "./binary-operator";
import { Expression } from "./expression";

export interface BinaryExpression {
  type: "binary";
  left: Expression;
  right: Expression;
  operator: BinaryOperator;
}
