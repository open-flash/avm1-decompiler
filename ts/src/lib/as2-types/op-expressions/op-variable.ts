import { Expression } from "../expression";

export interface OpVariable<L = null> {
  type: "OpVariable";
  loc: L;
  name: Expression<L>;
}
