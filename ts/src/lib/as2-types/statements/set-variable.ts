import { Expression, RoExpression } from "../expression";

export interface SetVariable<L = unknown> {
  type: "SetVariable";
  loc: L;
  name: Expression<L>;
  value: Expression<L>;
}

export interface RoSetVariable<L = unknown> {
  readonly type: "SetVariable";
  readonly loc: L;
  readonly name: RoExpression<L>;
  readonly value: RoExpression<L>;
}
