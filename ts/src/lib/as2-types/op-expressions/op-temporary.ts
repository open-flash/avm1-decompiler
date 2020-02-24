export interface OpTemporary<L = null> {
  type: "OpTemporary";
  loc: L;
  id: number;
}
