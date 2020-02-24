import { Expression } from "../expression";

export interface SequenceExpression<L = null> {
  type: "SequenceExpression";
  loc: L;
  expressions: Expression<L>[];
}
