export interface NullLiteral<L = unknown> {
  type: "NullLiteral";
  loc: L;
}

export interface RoNullLiteral<L = unknown> {
  readonly type: "NullLiteral";
  readonly loc: L;
}
