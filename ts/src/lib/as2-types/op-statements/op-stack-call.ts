import { Expression, RoExpression } from "../expression";
import { OpTemporaryPattern, RoOpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpStackCall<L = unknown> {
  type: "OpStackCall";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  callee: Expression<L>;
  argCount: Expression<L>;
}

export interface RoOpStackCall<L = unknown> {
  readonly type: "OpStackCall";
  readonly loc: L;
  readonly target: RoOpTemporaryPattern<L> | null;
  readonly callee: RoExpression<L>;
  readonly argCount: RoExpression<L>;
}
