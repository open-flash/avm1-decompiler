import { Expression } from "../expression";

export interface ExpressionStatement<L = null> {
  type: "ExpressionStatement";
  loc: L;
  expression: Expression<L>;
}
