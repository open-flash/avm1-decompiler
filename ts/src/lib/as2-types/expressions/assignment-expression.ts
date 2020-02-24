import { AssignmentOperator } from "../assignment-operator";
import { Expression } from "../expression";
import { Pattern } from "../pattern";

export interface AssignmentExpression<L = null> {
  type: "AssignmentExpression";
  loc: L;
  operator: AssignmentOperator;
  target: Pattern<L>;
  value: Expression<L>;
}
