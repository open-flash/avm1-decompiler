import { Expression } from "../expression";

export interface OpEnumerate<L = null> {
  type: "OpEnumerate";
  loc: L;
  value: Expression<L>;
}
