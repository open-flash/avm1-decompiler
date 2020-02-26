export interface OpTemporary<L = unknown> {
  type: "OpTemporary";
  loc: L;
  id: number;
}

export interface RoOpTemporary<L = unknown> {
  readonly type: "OpTemporary";
  readonly loc: L;
  readonly id: number;
}
