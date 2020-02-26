import { Expression, RoExpression } from "../expression";

export interface ConditionalExpression<L = unknown> {
  type: "ConditionalExpression";
  loc: L;
  test: Expression<L>;
  truthy: Expression<L>;
  falsy: Expression<L>;
}

export interface RoConditionalExpression<L = unknown> {
  readonly type: "ConditionalExpression";
  readonly loc: L;
  readonly test: RoExpression<L>;
  readonly truthy: RoExpression<L>;
  readonly falsy: RoExpression<L>;
}
