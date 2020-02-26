export interface OpRegister<L = unknown> {
  type: "OpRegister";
  loc: L;
  id: number;
}

export interface RoOpRegister<L = unknown> {
  readonly type: "OpRegister";
  readonly loc: L;
  readonly id: number;
}
