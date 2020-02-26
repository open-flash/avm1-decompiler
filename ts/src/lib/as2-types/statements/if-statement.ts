import { Expression, RoExpression } from "../expression";
import { RoStatement, Statement } from "../statement";

export interface IfStatement<L = unknown> {
  type: "IfStatement";
  loc: L;
  test: Expression<L>;
  truthy: Statement<L>;
  falsy: Statement<L> | null;
}

export interface RoIfStatement<L = unknown> {
  readonly type: "IfStatement";
  readonly loc: L;
  readonly test: RoExpression<L>;
  readonly truthy: RoStatement<L>;
  readonly falsy: RoStatement<L> | null;
}
