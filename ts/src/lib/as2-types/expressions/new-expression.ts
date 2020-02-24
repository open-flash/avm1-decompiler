import { Expression } from "../expression";

export interface NewExpression<L = null> {
  type: "NewExpression";
  loc: L;
  callee: Expression<L>;
  arguments: Expression<L>[];
}
