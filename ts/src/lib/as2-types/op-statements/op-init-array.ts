import { Expression } from "../expression";
import { OpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpInitArray<L = unknown> {
  type: "OpInitArray";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  itemCount: Expression<L>;
}

export interface RoOpInitArray<L = unknown> {
  readonly type: "OpInitArray";
  readonly loc: L;
  readonly target: OpTemporaryPattern<L> | null;
  readonly itemCount: Expression<L>;
}
