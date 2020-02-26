import { Expression, RoExpression } from "../expression";
import { UnaryOperator } from "../unary-operator";

export interface UnaryExpression<L = unknown> {
  type: "UnaryExpression";
  loc: L;
  operator: UnaryOperator;
  argument: Expression<L>;
}

export interface RoUnaryExpression<L = unknown> {
  readonly type: "UnaryExpression";
  readonly loc: L;
  readonly operator: UnaryOperator;
  readonly argument: RoExpression<L>;
}
