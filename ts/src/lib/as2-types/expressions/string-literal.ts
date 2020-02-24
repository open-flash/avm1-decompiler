export interface StringLiteral<L = null> {
  type: "StringLiteral";
  loc: L;
  value: string;
}
