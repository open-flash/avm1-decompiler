import { Statement } from "../statement";

export interface BlockStatement<L = null> {
  type: "BlockStatement";
  loc: L;
  body: Statement<L>[];
}
