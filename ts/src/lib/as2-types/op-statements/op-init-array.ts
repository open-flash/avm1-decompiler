import { Expression } from "../expression";
import { OpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpInitArray<L = null> {
  type: "OpInitArray";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  itemCount: Expression<L>;
}
