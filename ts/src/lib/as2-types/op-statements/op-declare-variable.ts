import { Expression, RoExpression } from "../expression";

export interface OpDeclareVariable<L = unknown> {
  type: "OpDeclareVariable";
  loc: L;
  name: Expression<L>;
  value: Expression<L> | null;
}

export interface RoOpDeclareVariable<L = unknown> {
  readonly type: "OpDeclareVariable";
  readonly loc: L;
  readonly name: RoExpression<L>;
  readonly value: RoExpression<L> | null;
}
