import { Expression } from "../expression";
import { OpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpCallFunction<L = null> {
  type: "OpCallFunction";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  callee: Expression<L>;
  argCount: Expression<L>;
}
