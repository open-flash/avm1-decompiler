import { Expression } from "./as2-tree/expression";

export interface PartialExpr {
  inputs: number;
  expr: Expression;
  type: any;
}
