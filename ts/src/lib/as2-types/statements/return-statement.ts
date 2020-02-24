import { Expression } from "../expression";

export interface ReturnStatement<L = null> {
  type: "ReturnStatement";
  loc: L;
  value: Expression<L> | null;
}
