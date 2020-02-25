import { Expression } from "../expression";

export interface OpTrace<L = null> {
  type: "OpTrace";
  loc: L;
  value: Expression<L>;
}
