import { Expression } from "../expression";

export interface OpPush<L = null> {
  type: "OpPush";
  loc: L;
  value: Expression<L>;
}
