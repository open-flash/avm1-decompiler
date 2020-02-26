import { Expression } from "../expression";

export interface OpCallFunction<L = null> {
  type: "OpCallFunction";
  loc: L;
  callee: Expression<L>;
  argCount: Expression<L>;
  arguments: Expression<L>[];
}
