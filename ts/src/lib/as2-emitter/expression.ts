import { AssignmentExpression } from "../as2-tree/assignment-expression";
import { BinaryExpression } from "../as2-tree/binary-expression";
import { BinaryOperator } from "../as2-tree/binary-operator";
import { Expression } from "../as2-tree/expression";
import { Identifier } from "../as2-tree/identifier";
import { MemberExpression } from "../as2-tree/member-expression";
import { Pattern } from "../as2-tree/pattern";
import { StringLiteral } from "../as2-tree/string-literal";
import { Constant } from "../as2-tree/partial/constant";
import { BooleanLiteral } from "../as2-tree/boolean-literal";

export function emitExpression(expr: Expression) {
  const chunks: string[] = [];
  writeExpression(chunks, expr);
  return chunks.join("");
}

function writeExpression(chunks: string[], expr: Expression) {
  switch (expr.type) {
    case "_constant":
      writeConstant(chunks, expr);
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
    case "identifier":
      writeIdentifier(chunks, expr);
      break;
    case "member":
      writeMemberExpression(chunks, expr);
      break;
    case "string-literal":
      writeStringLiteral(chunks, expr);
      break;
    default:
      throw new Error(`Unknown \`Expression#type\` value: ${JSON.stringify(expr.type)}`);
  }
}

function writePattern(chunks: string[], expr: Pattern) {
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

function writeAssignmentExpression(chunks: string[], expr: AssignmentExpression) {
  writePattern(chunks, expr.target);
  chunks.push(" = ");
  writeExpression(chunks, expr.value);
}

const BINARY_OPERATORS: ReadonlyMap<BinaryOperator, string> = new Map([
  [BinaryOperator.Add, "+"],
]);

function writeBinaryExpression(chunks: string[], expr: BinaryExpression) {
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

function writeBooleanLiteral(chunks: string[], expr: BooleanLiteral) {
  chunks.push(expr.value ? "true" : "false");
}

function writeConstant(chunks: string[], expr: Constant) {
  chunks.push(`c:${expr.id.toString(10)}`);
}

function writeIdentifier(chunks: string[], expr: Identifier) {
  chunks.push(expr.value);
}

function writeMemberExpression(chunks: string[], expr: MemberExpression) {
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
