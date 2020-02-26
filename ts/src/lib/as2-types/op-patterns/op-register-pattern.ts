export interface OpRegisterPattern<L = unknown> {
  type: "OpRegisterPattern";
  loc: L;
  id: number;
}

export interface RoOpRegisterPattern<L = unknown> {
  readonly type: "OpRegisterPattern";
  readonly loc: L;
  readonly id: number;
}
