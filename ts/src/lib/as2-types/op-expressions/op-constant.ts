export interface OpConstant<L = unknown> {
  type: "OpConstant";
  loc: L;
  id: number;
}

export interface RoOpConstant<L = unknown> {
  readonly type: "OpConstant";
  readonly loc: L;
  readonly id: number;
}
