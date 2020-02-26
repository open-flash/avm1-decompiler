import { Expression } from "../expression";

export interface OpInitObject<L = null> {
  type: "OpInitObject";
  loc: L;
  itemCount: Expression<L>;
}
