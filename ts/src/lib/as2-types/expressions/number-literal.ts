export interface NumberLiteral<L = unknown> {
  type: "NumberLiteral";
  loc: L;
  value: number;
}

export interface RoNumberLiteral<L = unknown> {
  readonly type: "NumberLiteral";
  readonly loc: L;
  readonly value: number;
}
