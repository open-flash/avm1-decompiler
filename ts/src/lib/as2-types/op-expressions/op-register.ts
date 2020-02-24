export interface OpRegister<L = null> {
  type: "OpRegister";
  loc: L;
  id: number;
}
