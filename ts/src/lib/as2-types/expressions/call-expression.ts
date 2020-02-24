import { Expression } from "../expression";

export interface CallExpression<L = null> {
  type: "CallExpression";
  loc: L;
  callee: Expression<L>;
  arguments: Expression<L>[];
}
