import { Expression } from "./expression";
import { UnaryOperator } from "./unary-operator";

export interface UnaryExpression {
  type: "unary-expression";
  argument: Expression;
  operator: UnaryOperator;
}

export function makeUnaryExpression(operator: UnaryOperator, argument: Expression): UnaryExpression {
  return {type: "unary-expression", operator, argument};
}
