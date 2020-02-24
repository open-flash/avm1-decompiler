import { Expression } from "../expression";

export interface MemberPattern<L = null> {
  type: "MemberPattern";
  loc: L;
  base: Expression<L>;
  key: Expression<L>;
}
