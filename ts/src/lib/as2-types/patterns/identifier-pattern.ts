export interface IdentifierPattern<L = null> {
  type: "IdentifierPattern";
  loc: L;
  name: string;
}
