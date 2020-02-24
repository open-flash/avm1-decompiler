export interface BooleanLiteral<L = null> {
  type: "BooleanLiteral";
  loc: L;
  value: boolean;
}
