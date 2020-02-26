import { RoStringLiteral, StringLiteral } from "../expressions/string-literal";

export interface OpConstantPool<L = unknown> {
  type: "OpConstantPool";
  loc: L;
  pool: StringLiteral<L>[];
}

export interface RoOpConstantPool<L = unknown> {
  readonly type: "OpConstantPool";
  readonly loc: L;
  readonly pool: readonly RoStringLiteral<L>[];
}
