import { Expression } from "./expression";
import { Pattern } from "./pattern";

export interface AssignmentExpression {
  type: "assignment";
  target: Pattern;
  value: Expression;
}
