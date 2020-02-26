export interface StringLiteral<L = unknown> {
  type: "StringLiteral";
  loc: L;
  value: string;
}

export interface RoStringLiteral<L = unknown> {
  readonly type: "StringLiteral";
  readonly loc: L;
  readonly value: string;
}
