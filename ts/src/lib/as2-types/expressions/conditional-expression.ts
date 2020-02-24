import { Expression } from "../expression";

export interface ConditionalExpression<L = null> {
  type: "ConditionalExpression";
  loc: L;
  test: Expression<L>;
  truthy: Expression<L>;
  falsy: Expression<L>;
}
