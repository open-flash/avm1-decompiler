export interface OpConstant<L = null> {
  type: "OpConstant";
  loc: L;
  id: number;
}
