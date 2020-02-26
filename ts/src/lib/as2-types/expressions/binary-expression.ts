import { BinaryOperator } from "../binary-operator";
import { Expression, RoExpression } from "../expression";

export interface BinaryExpression<L = unknown> {
  type: "BinaryExpression";
  loc: L;
  operator: BinaryOperator;
  left: Expression<L>;
  right: Expression<L>;
}

export interface RoBinaryExpression<L = unknown> {
  readonly type: "BinaryExpression";
  readonly loc: L;
  readonly operator: BinaryOperator;
  readonly left: RoExpression<L>;
  readonly right: RoExpression<L>;
}
