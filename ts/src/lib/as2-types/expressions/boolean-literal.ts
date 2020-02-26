export interface BooleanLiteral<L = unknown> {
  type: "BooleanLiteral";
  loc: L;
  value: boolean;
}

export interface RoBooleanLiteral<L = unknown> {
  readonly type: "BooleanLiteral";
  readonly loc: L;
  readonly value: boolean;
}
