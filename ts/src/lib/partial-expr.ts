import { Expression } from "./as2-tree/expression";

export interface PartialExpr {
  inputs: number;
  expr: Expression;

  /**
   * Indicates if the result must be discarded or not.
   *
   * `false`: The result must be pushed on the stack.
   * `true`: The result must not be pushed on the stack.
   */
  void: boolean;
  type: any;
}
