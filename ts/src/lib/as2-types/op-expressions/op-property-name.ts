import { Expression, RoExpression } from "../expression";

export interface OpPropertyName<L = unknown> {
  type: "OpPropertyName";
  loc: L;
  index: Expression<L>;
}

export interface RoOpPropertyName<L = unknown> {
  readonly type: "OpPropertyName";
  readonly loc: L;
  readonly index: RoExpression<L>;
}
