export interface NumberLiteral<L = null> {
  type: "NumberLiteral";
  loc: L;
  value: number;
}
