import { Expression, RoExpression } from "../expression";

export interface MemberExpression<L = unknown> {
  type: "MemberExpression";
  loc: L;
  base: Expression<L>;
  key: Expression<L>;
}

export interface RoMemberExpression<L = unknown> {
  readonly type: "MemberExpression";
  readonly loc: L;
  readonly base: RoExpression<L>;
  readonly key: RoExpression<L>;
}
