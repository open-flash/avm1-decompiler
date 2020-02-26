/**
 * Represents the value of `_global`.
 */
export interface OpGlobal<L = unknown> {
  type: "OpGlobal";
  loc: L;
}

export interface RoOpGlobal<L = unknown> {
  readonly type: "OpGlobal";
  readonly loc: L;
}
