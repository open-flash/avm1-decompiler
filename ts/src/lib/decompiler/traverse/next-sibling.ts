import { AssignmentExpression, RoAssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { BinaryExpression, RoBinaryExpression } from "../../as2-types/expressions/binary-expression";
import { BooleanLiteral, RoBooleanLiteral } from "../../as2-types/expressions/boolean-literal";
import { CallExpression, RoCallExpression } from "../../as2-types/expressions/call-expression";
import { ConditionalExpression, RoConditionalExpression } from "../../as2-types/expressions/conditional-expression";
import { Identifier, RoIdentifier } from "../../as2-types/expressions/identifier";
import { LogicalExpression, RoLogicalExpression } from "../../as2-types/expressions/logical-expression";
import { MemberExpression, RoMemberExpression } from "../../as2-types/expressions/member-expression";
import { NewExpression, RoNewExpression } from "../../as2-types/expressions/new-expression";
import { NullLiteral, RoNullLiteral } from "../../as2-types/expressions/null-literal";
import { NumberLiteral, RoNumberLiteral } from "../../as2-types/expressions/number-literal";
import { RoSequenceExpression, SequenceExpression } from "../../as2-types/expressions/sequence-expression";
import { RoStringLiteral, StringLiteral } from "../../as2-types/expressions/string-literal";
import { RoUnaryExpression, UnaryExpression } from "../../as2-types/expressions/unary-expression";
import { Node, RoNode } from "../../as2-types/node";
import { OpConstant, RoOpConstant } from "../../as2-types/op-expressions/op-constant";
import { OpGlobal, RoOpGlobal } from "../../as2-types/op-expressions/op-global";
import { OpPop, RoOpPop } from "../../as2-types/op-expressions/op-pop";
import { OpPropertyName, RoOpPropertyName } from "../../as2-types/op-expressions/op-property-name";
import { OpRegister, RoOpRegister } from "../../as2-types/op-expressions/op-register";
import { OpTemporary, RoOpTemporary } from "../../as2-types/op-expressions/op-temporary";
import { OpUndefined, RoOpUndefined } from "../../as2-types/op-expressions/op-undefined";
import { OpVariable, RoOpVariable } from "../../as2-types/op-expressions/op-variable";
import { OpRegisterPattern, RoOpRegisterPattern } from "../../as2-types/op-patterns/op-register-pattern";
import { OpStackCall, RoOpStackCall } from "../../as2-types/op-statements/op-stack-call";
import { OpConstantPool, RoOpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { OpDeclareVariable, RoOpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { OpEnumerate, RoOpEnumerate } from "../../as2-types/op-statements/op-enumerate";
import { OpInitArray, RoOpInitArray } from "../../as2-types/op-statements/op-init-array";
import { OpInitObject, RoOpInitObject } from "../../as2-types/op-statements/op-init-object";
import { OpPush, RoOpPush } from "../../as2-types/op-statements/op-push";
import { OpTrace, RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { IdentifierPattern, RoIdentifierPattern } from "../../as2-types/patterns/identifier-pattern";
import { MemberPattern, RoMemberPattern } from "../../as2-types/patterns/member-pattern";
import { RoScript, Script } from "../../as2-types/script";
import { BlockStatement, RoBlockStatement } from "../../as2-types/statements/block-statement";
import { RoEmptyStatement } from "../../as2-types/statements/empty-statement";
import { RoExpressionStatement } from "../../as2-types/statements/expression-statement";
import { IfFrameLoadedStatement, RoIfFrameLoadedStatement } from "../../as2-types/statements/if-frame-loaded-statement";
import { IfStatement, RoIfStatement } from "../../as2-types/statements/if-statement";
import { ReturnStatement, RoReturnStatement } from "../../as2-types/statements/return-statement";
import { RoSetVariable, SetVariable } from "../../as2-types/statements/set-variable";
import { RoThrowStatement, ThrowStatement } from "../../as2-types/statements/throw-statement";
import { NodeParent } from "./tree-state";

// tslint:disable:cyclomatic-complexity no-switch-case-fall-through

export function getNextSibling<N extends Node>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
export function getNextSibling<N extends RoNode>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
export function getNextSibling(parent: any): any {
  switch (parent.node.type) {
    case "Script":
      return script(parent);
    case "BlockStatement":
      return blockStatement(parent);
    case "EmptyStatement":
      return emptyStatement(parent);
    case "ExpressionStatement":
      return expressionStatement(parent);
    case "IfFrameLoadedStatement":
      return ifFrameLoadedStatement(parent);
    case "IfStatement":
      return ifStatement(parent);
    case "OpCallFunction":
      return opCallFunction(parent);
    case "OpConstantPool":
      return opConstantPool(parent);
    case "OpDeclareVariable":
      return opDeclareVariable(parent);
    case "OpEnumerate":
      return opEnumerate(parent);
    case "OpInitArray":
      return opInitArray(parent);
    case "OpInitObject":
      return opInitObject(parent);
    case "OpPush":
      return opPush(parent);
    case "OpTrace":
      return opTrace(parent);
    case "ReturnStatement":
      return returnStatement(parent);
    case "SetVariable":
      return setVariable(parent);
    case "ThrowStatement":
      return throwStatement(parent);
    case "AssignmentExpression":
      return assignmentExpression(parent);
    case "BinaryExpression":
      return binaryExpression(parent);
    case "BooleanLiteral":
      return booleanLiteral(parent);
    case "CallExpression":
      return callExpression(parent);
    case "ConditionalExpression":
      return conditionalExpression(parent);
    case "Identifier":
      return identifier(parent);
    case "LogicalExpression":
      return logicalExpression(parent);
    case "MemberExpression":
      return memberExpression(parent);
    case "NewExpression":
      return newExpression(parent);
    case "NullLiteral":
      return nullLiteral(parent);
    case "NumberLiteral":
      return numberLiteral(parent);
    case "OpConstant":
      return opConstant(parent);
    case "OpGlobal":
      return opGlobal(parent);
    case "OpPop":
      return opPop(parent);
    case "OpPropertyName":
      return opPropertyName(parent);
    case "OpRegister":
      return opRegister(parent);
    case "OpTemporary":
      return opTemporary(parent);
    case "OpUndefined":
      return opUndefined(parent);
    case "OpVariable":
      return opVariable(parent);
    case "SequenceExpression":
      return sequenceExpression(parent);
    case "StringLiteral":
      return stringLiteral(parent);
    case "UnaryExpression":
      return unaryExpression(parent);
    case "IdentifierPattern":
      return identifierPattern(parent);
    case "MemberPattern":
      return memberPattern(parent);
    case "OpRegisterPattern":
      return opRegisterPattern(parent);
    case "OpTemporaryPattern":
      return opTemporaryPattern(parent);
    default:
      throw new Error("Unexpected Node type");
  }
}

function script<N extends Script>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function script<N extends RoScript>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.body.length) {
    return parent.node.body[nextIndex];
  } else {
    return undefined;
  }
}

function blockStatement<N extends BlockStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function blockStatement<N extends RoBlockStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.body.length) {
    return parent.node.body[nextIndex];
  } else {
    return undefined;
  }
}

function emptyStatement<N extends RoEmptyStatement>(_parent: NodeParent<N>): Node<N["loc"]> | undefined {
  return undefined;
}

function expressionStatement<N extends RoExpressionStatement>(_parent: NodeParent<N>): Node<N["loc"]> | undefined {
  return undefined;
}

function ifFrameLoadedStatement<N extends IfFrameLoadedStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
// tslint:disable-next-line:max-line-length
function ifFrameLoadedStatement<N extends RoIfFrameLoadedStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "scene":
      return parent.node.frame;
    case "frame":
      return parent.node.ready;
    // @ts-ignore
    case "ready":
      if (parent.node.loading !== null) {
        return parent.node.loading;
      }
    // Fall-through
    case "loading":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function ifStatement<N extends IfStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function ifStatement<N extends RoIfStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "test":
      return parent.node.truthy;
    // @ts-ignore
    case "truthy":
      if (parent.node.falsy !== null) {
        return parent.node.falsy;
      }
    // Fall-through
    case "falsy":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opCallFunction<N extends OpStackCall>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opCallFunction<N extends RoOpStackCall>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "target":
      return parent.node.callee;
    // @ts-ignore
    case "callee":
      if (parent.node.callee !== null) {
        return parent.node.callee;
      }
    // Fall-through
    case "argCount":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opConstantPool<N extends OpConstantPool>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opConstantPool<N extends RoOpConstantPool>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.pool.length) {
    return parent.node.pool[nextIndex];
  } else {
    return undefined;
  }
}

function opDeclareVariable<N extends OpDeclareVariable>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opDeclareVariable<N extends RoOpDeclareVariable>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    // @ts-ignore
    case "name":
      if (parent.node.value !== null) {
        return parent.node.value;
      }
    // Fall-through
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opEnumerate<N extends OpEnumerate>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opEnumerate<N extends RoOpEnumerate>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opInitArray<N extends OpInitArray>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opInitArray<N extends RoOpInitArray>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "target":
      return parent.node.itemCount;
    case "itemCount":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opInitObject<N extends OpInitObject>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opInitObject<N extends RoOpInitObject>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "target":
      return parent.node.itemCount;
    case "itemCount":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opPush<N extends OpPush>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opPush<N extends RoOpPush>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opTrace<N extends OpTrace>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opTrace<N extends RoOpTrace>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function returnStatement<N extends ReturnStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function returnStatement<N extends RoReturnStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function setVariable<N extends SetVariable>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function setVariable<N extends RoSetVariable>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "name":
      return parent.node.value;
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function throwStatement<N extends ThrowStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function throwStatement<N extends RoThrowStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function assignmentExpression<N extends AssignmentExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function assignmentExpression<N extends RoAssignmentExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "target":
      return parent.node.value;
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function binaryExpression<N extends BinaryExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function binaryExpression<N extends RoBinaryExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "left":
      return parent.node.right;
    case "right":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function booleanLiteral<N extends BooleanLiteral>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function booleanLiteral<N extends RoBooleanLiteral>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function callExpression<N extends CallExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function callExpression<N extends RoCallExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "callee":
      return parent.node.arguments.length === 0 ? parent.node.arguments[0] : undefined;
    case "arguments":
      const nextIndex: number = parent.index + 1;
      return nextIndex < parent.node.arguments.length ? parent.node.arguments[nextIndex] : undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function conditionalExpression<N extends ConditionalExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function conditionalExpression<N extends RoConditionalExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "test":
      return parent.node.truthy;
    case "truthy":
      return parent.node.falsy;
    case "falsy":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function identifier<N extends Identifier>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function identifier<N extends RoIdentifier>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function logicalExpression<N extends LogicalExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function logicalExpression<N extends RoLogicalExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "left":
      return parent.node.right;
    case "right":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function memberExpression<N extends MemberExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function memberExpression<N extends RoMemberExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "base":
      return parent.node.key;
    case "key":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function newExpression<N extends NewExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function newExpression<N extends RoNewExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "callee":
      return parent.node.arguments.length === 0 ? parent.node.arguments[0] : undefined;
    case "arguments":
      const nextIndex: number = parent.index + 1;
      return nextIndex < parent.node.arguments.length ? parent.node.arguments[nextIndex] : undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function nullLiteral<N extends NullLiteral>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function nullLiteral<N extends RoNullLiteral>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function numberLiteral<N extends NumberLiteral>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function numberLiteral<N extends RoNumberLiteral>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opConstant<N extends OpConstant>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opConstant<N extends RoOpConstant>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opGlobal<N extends OpGlobal>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opGlobal<N extends RoOpGlobal>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opPop<N extends OpPop>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opPop<N extends RoOpPop>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opPropertyName<N extends OpPropertyName>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opPropertyName<N extends RoOpPropertyName>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "index":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opRegister<N extends OpRegister>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opRegister<N extends RoOpRegister>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opTemporary<N extends OpTemporary>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opTemporary<N extends RoOpTemporary>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opUndefined<N extends OpUndefined>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opUndefined<N extends RoOpUndefined>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opVariable<N extends OpVariable>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opVariable<N extends RoOpVariable>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "name":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function sequenceExpression<N extends SequenceExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function sequenceExpression<N extends RoSequenceExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.expressions.length) {
    return parent.node.expressions[nextIndex];
  } else {
    return undefined;
  }
}

function stringLiteral<N extends StringLiteral>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function stringLiteral<N extends RoStringLiteral>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function unaryExpression<N extends UnaryExpression>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function unaryExpression<N extends RoUnaryExpression>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "argument":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function identifierPattern<N extends IdentifierPattern>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function identifierPattern<N extends RoIdentifierPattern>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function memberPattern<N extends MemberPattern>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function memberPattern<N extends RoMemberPattern>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  switch (parent.key) {
    case "base":
      return parent.node.key;
    case "key":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opRegisterPattern<N extends OpRegisterPattern>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opRegisterPattern<N extends RoOpRegisterPattern>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}

function opTemporaryPattern<N extends OpRegisterPattern>(_parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opTemporaryPattern<N extends RoOpRegisterPattern>(_parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
  return undefined;
}
