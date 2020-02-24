export interface OpRegisterPattern<L = null> {
  type: "OpRegisterPattern";
  loc: L;
  id: number;
}
