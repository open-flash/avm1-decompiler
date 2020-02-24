import { Expression } from "./expression";

export interface MemberExpression {
  type: "member";
  object: Expression;
  property: Expression;
}
