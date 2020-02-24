import { Expression } from "../expression";

export interface ThrowStatement<L = null> {
  type: "ThrowStatement";
  loc: L;
  value: Expression<L> | null;
}
