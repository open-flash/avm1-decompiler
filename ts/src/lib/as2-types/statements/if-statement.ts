import { Expression } from "../expression";
import { Statement } from "../statement";

export interface IfStatement<L = null> {
  type: "IfStatement";
  loc: L;
  test: Expression<L>;
  truthy: Statement<L>;
  falsy: Statement<L> | null;
}
