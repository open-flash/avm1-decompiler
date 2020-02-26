import { Expression, RoExpression } from "../expression";
import { OpTemporaryPattern, RoOpTemporaryPattern } from "../op-patterns/op-temporary-pattern";

export interface OpInitObject<L = unknown> {
  type: "OpInitObject";
  loc: L;
  target: OpTemporaryPattern<L> | null;
  itemCount: Expression<L>;
}

export interface RoOpInitObject<L = unknown> {
  readonly type: "OpInitObject";
  readonly loc: L;
  readonly target: RoOpTemporaryPattern<L> | null;
  readonly itemCount: RoExpression<L>;
}
