export interface NullLiteral<L = null> {
  type: "NullLiteral";
  loc: L;
}
