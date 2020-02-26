import { Expression, RoExpression } from "../expression";

export interface ReturnStatement<L = unknown> {
  type: "ReturnStatement";
  loc: L;
  value: Expression<L> | null;
}

export interface RoReturnStatement<L = unknown> {
  readonly type: "ReturnStatement";
  readonly loc: L;
  readonly value: RoExpression<L> | null;
}
