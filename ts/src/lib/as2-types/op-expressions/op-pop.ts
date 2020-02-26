export interface OpPop<L = unknown> {
  type: "OpPop";
  loc: L;
}

export interface RoOpPop<L = unknown> {
  readonly type: "OpPop";
  readonly loc: L;
}
