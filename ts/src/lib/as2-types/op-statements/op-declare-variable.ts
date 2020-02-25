import { Expression } from "../expression";

export interface OpDeclareVariable<L = null> {
  type: "OpDeclareVariable";
  loc: L;
  name: Expression<L>;
  value: Expression<L> | null;
}
