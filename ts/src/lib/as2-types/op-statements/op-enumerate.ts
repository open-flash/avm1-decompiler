import { Expression, RoExpression } from "../expression";

export interface OpEnumerate<L = unknown> {
  type: "OpEnumerate";
  loc: L;
  value: Expression<L>;
}

export interface RoOpEnumerate<L = unknown> {
  readonly type: "OpEnumerate";
  readonly loc: L;
  readonly value: RoExpression<L>;
}
