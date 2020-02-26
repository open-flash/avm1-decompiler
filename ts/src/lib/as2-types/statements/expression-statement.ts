import { Expression } from "../expression";

export interface ExpressionStatement<L = unknown> {
  type: "ExpressionStatement";
  loc: L;
  expression: Expression<L>;
}

export interface RoExpressionStatement<L = unknown> {
  readonly type: "ExpressionStatement";
  readonly loc: L;
  readonly expression: Expression<L>;
}
