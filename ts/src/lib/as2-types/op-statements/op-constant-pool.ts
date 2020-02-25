import { StringLiteral } from "../expressions/string-literal";

export interface OpConstantPool<L = null> {
  type: "OpConstantPool";
  loc: L;
  pool: StringLiteral<L>[];
}
