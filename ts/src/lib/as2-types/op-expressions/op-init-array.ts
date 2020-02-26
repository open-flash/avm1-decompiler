import { Expression } from "../expression";

export interface OpInitArray<L = null> {
  type: "OpInitArray";
  loc: L;
  itemCount: Expression<L>;
}
