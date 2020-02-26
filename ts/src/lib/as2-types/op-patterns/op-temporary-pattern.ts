export interface OpTemporaryPattern<L = unknown> {
  type: "OpTemporaryPattern";
  loc: L;
  id: number;
}

export interface RoOpTemporaryPattern<L = unknown> {
  readonly type: "OpTemporaryPattern";
  readonly loc: L;
  readonly id: number;
}
