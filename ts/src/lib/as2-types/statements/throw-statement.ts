import { Expression, RoExpression } from "../expression";

export interface ThrowStatement<L = unknown> {
  type: "ThrowStatement";
  loc: L;
  value: Expression<L>;
}

export interface RoThrowStatement<L = unknown> {
  readonly type: "ThrowStatement";
  readonly loc: L;
  readonly value: RoExpression<L>;
}
