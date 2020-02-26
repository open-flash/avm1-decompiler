import { AssignmentOperator } from "../assignment-operator";
import { Expression, RoExpression } from "../expression";
import { Pattern, RoPattern } from "../pattern";

export interface AssignmentExpression<L = unknown> {
  type: "AssignmentExpression";
  loc: L;
  operator: AssignmentOperator;
  target: Pattern<L>;
  value: Expression<L>;
}

export interface RoAssignmentExpression<L = unknown> {
  readonly type: "AssignmentExpression";
  readonly loc: L;
  readonly operator: AssignmentOperator;
  readonly target: RoPattern<L>;
  readonly value: RoExpression<L>;
}
