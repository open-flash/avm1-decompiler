import { Expression, RoExpression } from "../expression";
import { RoStatement, Statement } from "../statement";

export interface IfFrameLoadedStatement<L = unknown> {
  type: "IfFrameLoadedStatement";
  loc: L;
  scene: Expression<L> | null;
  frame: Expression<L>;
  ready: Statement<L>;
  loading: Statement<L> | null;
}

export interface RoIfFrameLoadedStatement<L = unknown> {
  readonly type: "IfFrameLoadedStatement";
  readonly loc: L;
  readonly scene: RoExpression<L> | null;
  readonly frame: RoExpression<L>;
  readonly ready: RoStatement<L>;
  readonly loading: RoStatement<L> | null;
}
