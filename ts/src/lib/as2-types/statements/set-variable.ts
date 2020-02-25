import { Expression } from "../expression";

export interface SetVariable<L = null> {
  type: "SetVariable";
  loc: L;
  name: Expression<L>;
  value: Expression<L>;
}
