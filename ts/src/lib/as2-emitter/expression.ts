import { AssignmentExpression } from "../as2-tree/assignment-expression";
import { BinaryExpression } from "../as2-tree/binary-expression";
import { BinaryOperator } from "../as2-tree/binary-operator";
import { BooleanLiteral } from "../as2-tree/boolean-literal";
import { CallExpression } from "../as2-tree/call-expression";
import { Expression } from "../as2-tree/expression";
import { Identifier } from "../as2-tree/identifier";
import { MemberExpression } from "../as2-tree/member-expression";
import { Constant } from "../as2-tree/partial/constant";
import { Input } from "../as2-tree/partial/input";
import { Pattern } from "../as2-tree/pattern";
import { StringLiteral } from "../as2-tree/string-literal";
import { UnaryExpression } from "../as2-tree/unary-expression";
import { UnaryOperator } from "../as2-tree/unary-operator";

export function emitExpression(expr: Expression): string {
  const chunks: string[] = [];
  writeExpression(chunks, expr);
  return chunks.join("");
}

function writeExpression(chunks: string[], expr: Expression): void {
  switch (expr.type) {
    case "_constant":
      writeConstant(chunks, expr);
      break;
    case "_input":
      writeInput(chunks, expr);
      break;
    case "assignment":
      writeAssignmentExpression(chunks, expr);
      break;
    case "binary":
      writeBinaryExpression(chunks, expr);
      break;
    case "boolean-literal":
      writeBooleanLiteral(chunks, expr);
      break;
    case "call-expression":
      writeCallExpression(chunks, expr);
      break;
    case "identifier":
      writeIdentifier(chunks, expr);
      break;
    case "member":
      writeMemberExpression(chunks, expr);
      break;
    case "string-literal":
      writeStringLiteral(chunks, expr);
      break;
    case "unary-expression":
      writeUnaryExpression(chunks, expr);
      break;
    default:
      throw new Error(`Unknown \`Expression#type\` value: ${JSON.stringify(expr.type)}`);
  }
}

function writePattern(chunks: string[], expr: Pattern): void {
  switch (expr.type) {
    case "identifier":
      writeIdentifier(chunks, expr);
      break;
    case "member":
      writeMemberExpression(chunks, expr);
      break;
    default:
      throw new Error("Unexpected pattern type");
  }
}

function writeAssignmentExpression(chunks: string[], expr: AssignmentExpression): void {
  writePattern(chunks, expr.target);
  chunks.push(" = ");
  writeExpression(chunks, expr.value);
}

const BINARY_OPERATORS: ReadonlyMap<BinaryOperator, string> = new Map([
  [BinaryOperator.Add, "+"],
]);

function writeBinaryExpression(chunks: string[], expr: BinaryExpression): void {
  chunks.push("(");
  writeExpression(chunks, expr.left);
  chunks.push(")");
  const op: string | undefined = BINARY_OPERATORS.get(expr.operator);
  if (op === undefined) {
    throw new Error(`Unknown BinaryOperator value: ${expr.operator}`);
  }
  chunks.push(op);
  chunks.push("(");
  writeExpression(chunks, expr.right);
  chunks.push(")");
}

function writeBooleanLiteral(chunks: string[], expr: BooleanLiteral): void {
  chunks.push(expr.value ? "true" : "false");
}

function writeCallExpression(chunks: string[], expr: CallExpression): void {
  chunks.push("(");
  writeExpression(chunks, expr.callee);
  chunks.push(")");
  chunks.push("(");
  let first: boolean = true;
  for (const arg of expr.arguments) {
    if (!first) {
      chunks.push(", ");
      first = true;
    }
    chunks.push("(");
    writeExpression(chunks, arg);
    chunks.push(")");
  }
  chunks.push(")");
}

function writeConstant(chunks: string[], expr: Constant): void {
  chunks.push(`c:${expr.id.toString(10)}`);
}

function writeIdentifier(chunks: string[], expr: Identifier): void {
  chunks.push(expr.value);
}

function writeInput(chunks: string[], expr: Input): void {
  chunks.push(`in:${expr.id.toString(10)}`);
}

function writeMemberExpression(chunks: string[], expr: MemberExpression): void {
  chunks.push("(");
  writeExpression(chunks, expr.object);
  chunks.push(")");
  chunks.push("[");
  writeExpression(chunks, expr.property);
  chunks.push("]");
}

function writeStringLiteral(chunks: string[], expr: StringLiteral) {
  chunks.push(JSON.stringify(expr.value));
}

const UNARY_OPERATORS: ReadonlyMap<UnaryOperator, string> = new Map([
  [UnaryOperator.BitNot, "~"],
  [UnaryOperator.LogicalNot, "!"],
]);

function writeUnaryExpression(chunks: string[], expr: UnaryExpression): void {
  const op: string | undefined = UNARY_OPERATORS.get(expr.operator);
  if (op === undefined) {
    throw new Error(`Unknown UnaryOperator value: ${expr.operator}`);
  }
  chunks.push(op);
  chunks.push("(");
  writeExpression(chunks, expr.argument);
  chunks.push(")");
}
