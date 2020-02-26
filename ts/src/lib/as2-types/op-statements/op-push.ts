import { Expression, RoExpression } from "../expression";

export interface OpPush<L = unknown> {
  type: "OpPush";
  loc: L;
  value: Expression<L>;
}

export interface RoOpPush<L = unknown> {
  readonly type: "OpPush";
  readonly loc: L;
  readonly value: RoExpression<L>;
}
