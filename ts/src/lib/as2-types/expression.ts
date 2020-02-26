import { AssignmentExpression, RoAssignmentExpression } from "./expressions/assignment-expression";
import { BinaryExpression, RoBinaryExpression } from "./expressions/binary-expression";
import { BooleanLiteral, RoBooleanLiteral } from "./expressions/boolean-literal";
import { CallExpression, RoCallExpression } from "./expressions/call-expression";
import { ConditionalExpression, RoConditionalExpression } from "./expressions/conditional-expression";
import { Identifier, RoIdentifier } from "./expressions/identifier";
import { LogicalExpression, RoLogicalExpression } from "./expressions/logical-expression";
import { MemberExpression, RoMemberExpression } from "./expressions/member-expression";
import { NewExpression, RoNewExpression } from "./expressions/new-expression";
import { NullLiteral, RoNullLiteral } from "./expressions/null-literal";
import { NumberLiteral, RoNumberLiteral } from "./expressions/number-literal";
import { RoSequenceExpression, SequenceExpression } from "./expressions/sequence-expression";
import { RoStringLiteral, StringLiteral } from "./expressions/string-literal";
import { RoUnaryExpression, UnaryExpression } from "./expressions/unary-expression";
import { OpConstant, RoOpConstant } from "./op-expressions/op-constant";
import { OpGlobal, RoOpGlobal } from "./op-expressions/op-global";
import { OpPop, RoOpPop } from "./op-expressions/op-pop";
import { OpPropertyName, RoOpPropertyName } from "./op-expressions/op-property-name";
import { OpRegister, RoOpRegister } from "./op-expressions/op-register";
import { OpTemporary, RoOpTemporary } from "./op-expressions/op-temporary";
import { OpUndefined, RoOpUndefined } from "./op-expressions/op-undefined";
import { OpVariable, RoOpVariable } from "./op-expressions/op-variable";

/**
 * Expressions correspond to nodes able to representation the value of an assignment.
 */
export type Expression<L = unknown> =
  AssignmentExpression<L>
  | BinaryExpression<L>
  | BooleanLiteral<L>
  | CallExpression<L>
  | ConditionalExpression<L>
  | Identifier<L>
  | LogicalExpression<L>
  | MemberExpression<L>
  | NewExpression<L>
  | NullLiteral<L>
  | NumberLiteral<L>
  | OpConstant<L>
  | OpGlobal<L>
  | OpPop<L>
  | OpPropertyName<L>
  | OpRegister<L>
  | OpTemporary<L>
  | OpUndefined<L>
  | OpVariable<L>
  | SequenceExpression<L>
  | StringLiteral<L>
  | UnaryExpression<L>;

export type RoExpression<L = unknown> =
  RoAssignmentExpression<L>
  | RoBinaryExpression<L>
  | RoBooleanLiteral<L>
  | RoCallExpression<L>
  | RoConditionalExpression<L>
  | RoIdentifier<L>
  | RoLogicalExpression<L>
  | RoMemberExpression<L>
  | RoNewExpression<L>
  | RoNullLiteral<L>
  | RoNumberLiteral<L>
  | RoOpConstant<L>
  | RoOpGlobal<L>
  | RoOpPop<L>
  | RoOpPropertyName<L>
  | RoOpRegister<L>
  | RoOpTemporary<L>
  | RoOpUndefined<L>
  | RoOpVariable<L>
  | RoSequenceExpression<L>
  | RoStringLiteral<L>
  | RoUnaryExpression<L>;
