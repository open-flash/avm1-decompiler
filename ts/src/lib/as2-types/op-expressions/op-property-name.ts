import { Expression } from "../expression";

export interface OpPropertyName<L = null> {
  type: "OpPropertyName";
  loc: L;
  index: Expression<L>;
}
