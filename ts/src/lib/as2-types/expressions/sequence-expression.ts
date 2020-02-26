import { Expression, RoExpression } from "../expression";

export interface SequenceExpression<L = unknown> {
  type: "SequenceExpression";
  loc: L;
  expressions: Expression<L>[];
}

export interface RoSequenceExpression<L = unknown> {
  readonly type: "SequenceExpression";
  readonly loc: L;
  readonly expressions: readonly RoExpression<L>[];
}
