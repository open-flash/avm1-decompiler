import { Expression } from "../expression";
import { Statement } from "../statement";

export interface IfFrameLoadedStatement<L = null> {
  type: "IfFrameLoadedStatement";
  loc: L;
  scene: Expression<L> | null;
  frame: Expression<L>;
  ready: Statement<L>;
  loading: Statement<L> | null;
}
