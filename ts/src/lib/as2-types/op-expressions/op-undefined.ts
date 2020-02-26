export interface OpUndefined<L = unknown> {
  type: "OpUndefined";
  loc: L;
}

export interface RoOpUndefined<L = unknown> {
  readonly type: "OpUndefined";
  readonly loc: L;
}
