import { Expression, RoExpression } from "../expression";

export interface OpTrace<L = unknown> {
  type: "OpTrace";
  loc: L;
  value: Expression<L>;
}

export interface RoOpTrace<L = unknown> {
  readonly type: "OpTrace";
  readonly loc: L;
  readonly value: RoExpression<L>;
}
