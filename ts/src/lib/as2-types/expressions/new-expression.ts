import { Expression, RoExpression } from "../expression";

export interface NewExpression<L = unknown> {
  type: "NewExpression";
  loc: L;
  callee: Expression<L>;
  arguments: Expression<L>[];
}

export interface RoNewExpression<L = unknown> {
  readonly type: "NewExpression";
  readonly loc: L;
  readonly callee: RoExpression<L>;
  readonly arguments: readonly RoExpression<L>[];
}
