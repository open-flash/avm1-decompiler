import { AssignmentExpression } from "./assignment-expression";
import { BinaryExpression } from "./binary-expression";
import { BooleanLiteral } from "./boolean-literal";
import { Identifier } from "./identifier";
import { MemberExpression } from "./member-expression";
import { Constant } from "./partial/constant";
import { Input } from "./partial/input";
import { Register } from "./partial/register";
import { StringLiteral } from "./string-literal";

export type Expression =
  AssignmentExpression
  | Constant
  | BinaryExpression
  | BooleanLiteral
  | Identifier
  | Input
  | MemberExpression
  | Register
  | StringLiteral;
