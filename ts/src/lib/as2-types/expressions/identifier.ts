export interface Identifier<L = null> {
  type: "Identifier";
  loc: L;
  name: string;
}
