import { Expression } from "./as2-types/expression";
import { AssignmentExpression } from "./as2-types/expressions/assignment-expression";
import { BinaryExpression } from "./as2-types/expressions/binary-expression";
import { BooleanLiteral } from "./as2-types/expressions/boolean-literal";
import { CallExpression } from "./as2-types/expressions/call-expression";
import { Identifier } from "./as2-types/expressions/identifier";
import { MemberExpression } from "./as2-types/expressions/member-expression";
import { StringLiteral } from "./as2-types/expressions/string-literal";
import { UnaryExpression } from "./as2-types/expressions/unary-expression";
import { OpConstant } from "./as2-types/op-expressions/op-constant";
import { OpTemporary } from "./as2-types/op-expressions/op-temporary";

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

export function mergePartialExpressions(first: PartialExpr, second: PartialExpr): PartialExpr | undefined {
  if (second.inputs === 0 || first.void) {
    return undefined;
  }
  const evalOptions: EvalOptions = {
    id: second.inputs - 1,
    shift: first.inputs,
    // TODO: Add assignment to tmp if the expression is not a value-expression
    value: first.expr as any,
  };
  const newExpression: Expression = evalExpression(second.expr, evalOptions);
  return {
    inputs: first.inputs + second.inputs - 1,
    expr: newExpression,
    void: second.void,
    type: second.type,
  };
}

interface EvalOptions {
  readonly id: number;
  readonly shift: number;
  readonly value: ValueExpression;
}

type ValueExpression = BooleanLiteral | OpConstant | Identifier | StringLiteral;

function evalExpression(expression: Expression, options: EvalOptions): Expression {
  switch (expression.type) {
    case "OpConstant":
    case "BooleanLiteral":
    case "Identifier":
    case "StringLiteral":
      return expression;
    case "OpTemporary":
      return evalInput(expression, options);
    case "AssignmentExpression":
      return evalAssignmentExpression(expression, options);
    case "BinaryExpression":
      return evalBinaryExpression(expression, options);
    case "CallExpression":
      return evalCallExpression(expression, options);
    case "MemberExpression":
      return evalMemberExpression(expression, options);
    case "UnaryExpression":
      return evalUnaryExpression(expression, options);
    default:
      throw new Error(`Unknown \`Expression#type\` value: ${JSON.stringify(expression.type)}`);
  }
}

function evalAssignmentExpression(expression: AssignmentExpression, options: EvalOptions): AssignmentExpression {
  const value: Expression = evalExpression(expression.value, options);
  if (value === expression.value) {
    return expression;
  }
  return {...expression, value};
}

function evalBinaryExpression(expression: BinaryExpression, options: EvalOptions): BinaryExpression {
  const left: Expression = evalExpression(expression.left, options);
  const right: Expression = evalExpression(expression.right, options);
  if (left === expression.left || right === expression.right) {
    return expression;
  }
  return {...expression, left, right};
}

function evalCallExpression(expression: CallExpression, options: EvalOptions): CallExpression {
  const callee: Expression = evalExpression(expression.callee, options);
  const args: Expression[] = [];
  let changed: boolean = callee !== expression.callee;
  for (const argument of expression.arguments) {
    const newArgument: Expression = evalExpression(argument, options);
    changed = changed || (newArgument !== argument);
    args.push(newArgument);
  }
  if (!changed) {
    return expression;
  }
  return {...expression, callee, arguments: args};
}

function evalInput(expression: OpTemporary, options: EvalOptions): OpTemporary | ValueExpression {
  if (expression.id === options.id) {
    return options.value;
  } else {
    return {type: "OpTemporary", loc: null, id: expression.id + options.shift};
  }
}

function evalMemberExpression(expression: MemberExpression, options: EvalOptions): MemberExpression {
  const object: Expression = evalExpression(expression.base, options);
  const property: Expression = evalExpression(expression.key, options);
  if (object === expression.base || property === expression.key) {
    return expression;
  }
  return {...expression, base: object, key: property};
}

function evalUnaryExpression(expression: UnaryExpression, options: EvalOptions): UnaryExpression {
  const argument: Expression = evalExpression(expression.argument, options);
  if (argument === expression.argument) {
    return expression;
  }
  return {...expression, argument};
}
