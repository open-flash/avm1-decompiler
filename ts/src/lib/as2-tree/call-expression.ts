import { Expression } from "./expression";

export interface CallExpression {
  type: "call-expression";
  callee: Expression;
  arguments: Expression[];
}

export function makeCallExpression(callee: Expression, args: Expression[]): CallExpression {
  return {
    type: "call-expression",
    callee,
    arguments: args,
  };
}
