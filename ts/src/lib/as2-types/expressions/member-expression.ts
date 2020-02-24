import { Expression } from "../expression";

export interface MemberExpression<L = null> {
  type: "MemberExpression";
  loc: L;
  base: Expression<L>;
  key: Expression<L>;
}
