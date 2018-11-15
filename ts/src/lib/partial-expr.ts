import { Expression } from "./as2-tree/expression";
import { Input, makeInput } from "./as2-tree/partial/input";
import { BinaryExpression } from "./as2-tree/binary-expression";
import { UnaryExpression } from "./as2-tree/unary-expression";
import { AssignmentExpression } from "./as2-tree/assignment-expression";
import { BooleanLiteral } from "./as2-tree/boolean-literal";
import { StringLiteral } from "./as2-tree/string-literal";
import { Identifier } from "./as2-tree/identifier";
import { Constant } from "./as2-tree/partial/constant";
import { CallExpression } from "./as2-tree/call-expression";
import { MemberExpression } from "./as2-tree/member-expression";

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

type ValueExpression = BooleanLiteral | Constant | Identifier | StringLiteral;

function evalExpression(expression: Expression, options: EvalOptions): Expression {
  switch (expression.type) {
    case "_constant":
    case "boolean-literal":
    case "identifier":
    case "string-literal":
      return expression;
    case "_input":
      return evalInput(expression, options);
    case "assignment":
      return evalAssignmentExpression(expression, options);
    case "binary":
      return evalBinaryExpression(expression, options);
    case "call-expression":
      return evalCallExpression(expression, options);
    case "member":
      return evalMemberExpression(expression, options);
    case "unary-expression":
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

function evalInput(expression: Input, options: EvalOptions): Input | ValueExpression {
  if (expression.id === options.id) {
    return options.value;
  } else {
    return makeInput(expression.id + options.shift);
  }
}

function evalMemberExpression(expression: MemberExpression, options: EvalOptions): MemberExpression {
  const object: Expression = evalExpression(expression.object, options);
  const property: Expression = evalExpression(expression.property, options);
  if (object === expression.object || property === expression.property) {
    return expression;
  }
  return {...expression, object, property};
}

function evalUnaryExpression(expression: UnaryExpression, options: EvalOptions): UnaryExpression {
  const argument: Expression = evalExpression(expression.argument, options);
  if (argument === expression.argument) {
    return expression;
  }
  return {...expression, argument};
}
