import { Expression } from "../expression";
import { OpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpInitObject<L = null> {
  type: "OpInitObject";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  itemCount: Expression<L>;
}
