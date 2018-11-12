import { Expression } from "./expression";
import { Pattern } from "./pattern";

export interface MemberExpression {
  type: "member";
  object: Expression;
  property: Expression;
}
