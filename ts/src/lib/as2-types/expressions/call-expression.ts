import { Expression, RoExpression } from "../expression";

export interface CallExpression<L = unknown> {
  type: "CallExpression";
  loc: L;
  callee: Expression<L>;
  arguments: Expression<L>[];
}

export interface RoCallExpression<L = unknown> {
  readonly type: "CallExpression";
  readonly loc: L;
  readonly callee: RoExpression<L>;
  readonly arguments: readonly RoExpression<L>[];
}
