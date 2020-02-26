import { Expression, RoExpression } from "../expression";

export interface MemberPattern<L = unknown> {
  type: "MemberPattern";
  loc: L;
  base: Expression<L>;
  key: Expression<L>;
}

export interface RoMemberPattern<L = unknown> {
  readonly type: "MemberPattern";
  readonly loc: L;
  readonly base: RoExpression<L>;
  readonly key: RoExpression<L>;
}
