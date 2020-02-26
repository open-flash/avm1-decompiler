import { Expression, RoExpression } from "../expression";
import { OpTemporaryPattern, RoOpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpCallFunction<L = unknown> {
  type: "OpCallFunction";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  callee: Expression<L>;
  argCount: Expression<L>;
}

export interface RoOpCallFunction<L = unknown> {
  readonly type: "OpCallFunction";
  readonly loc: L;
  readonly target: RoOpTemporaryPattern<L> | null;
  readonly callee: RoExpression<L>;
  readonly argCount: RoExpression<L>;
}
