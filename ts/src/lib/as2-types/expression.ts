import { AssignmentExpression } from "./expressions/assignment-expression";
import { BinaryExpression } from "./expressions/binary-expression";
import { BooleanLiteral } from "./expressions/boolean-literal";
import { CallExpression } from "./expressions/call-expression";
import { ConditionalExpression } from "./expressions/conditional-expression";
import { Identifier } from "./expressions/identifier";
import { LogicalExpression } from "./expressions/logical-expression";
import { MemberExpression } from "./expressions/member-expression";
import { NewExpression } from "./expressions/new-expression";
import { SequenceExpression } from "./expressions/sequence-expression";
import { StringLiteral } from "./expressions/string-literal";
import { UnaryExpression } from "./expressions/unary-expression";
import { OpConstant } from "./op-expressions/op-constant";
import { OpGlobal } from "./op-expressions/op-global";
import { OpPop } from "./op-expressions/op-pop";
import { OpRegister } from "./op-expressions/op-register";
import { OpTemporary } from "./op-expressions/op-temporary";

/**
 * Expressions correspond to nodes able to representation the value of an assignment.
 */
export type Expression<L = null> = AssignmentExpression<L>
  | BinaryExpression<L>
  | BooleanLiteral<L>
  | CallExpression<L>
  | ConditionalExpression<L>
  | Identifier<L>
  | LogicalExpression<L>
  | MemberExpression<L>
  | NewExpression<L>
  | OpConstant<L>
  | OpGlobal<L>
  | OpPop<L>
  | OpRegister<L>
  | OpTemporary<L>
  | SequenceExpression<L>
  | StringLiteral<L>
  | UnaryExpression<L>;
