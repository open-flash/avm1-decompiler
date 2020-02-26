import { Expression, RoExpression } from "../expression";

export interface OpVariable<L = unknown> {
  type: "OpVariable";
  loc: L;
  name: Expression<L>;
}

export interface RoOpVariable<L = unknown> {
  readonly type: "OpVariable";
  readonly loc: L;
  readonly name: RoExpression<L>;
}
