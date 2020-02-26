import { AssignmentExpression, RoAssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { RoStringLiteral, StringLiteral } from "../../as2-types/expressions/string-literal";
import { RoUnaryExpression, UnaryExpression } from "../../as2-types/expressions/unary-expression";
import { Node, RoNode } from "../../as2-types/node";
import { OpRegisterPattern, RoOpRegisterPattern } from "../../as2-types/op-patterns/op-register-pattern";
import { OpCallFunction, RoOpCallFunction } from "../../as2-types/op-statements/op-call-function";
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
      throw new Error("NotImplemented");
    case "SetVariable":
      throw new Error("NotImplemented");
    case "ThrowStatement":
      throw new Error("NotImplemented");
    case "AssignmentExpression":
      return assignmentExpression(parent);
    case "BinaryExpression":
      throw new Error("NotImplemented");
    case "BooleanLiteral":
      throw new Error("NotImplemented");
    case "CallExpression":
      throw new Error("NotImplemented");
    case "ConditionalExpression":
      throw new Error("NotImplemented");
    case "Identifier":
      throw new Error("NotImplemented");
    case "LogicalExpression":
      throw new Error("NotImplemented");
    case "MemberExpression":
      throw new Error("NotImplemented");
    case "NewExpression":
      throw new Error("NotImplemented");
    case "NullLiteral":
      throw new Error("NotImplemented");
    case "NumberLiteral":
      throw new Error("NotImplemented");
    case "OpConstant":
      throw new Error("NotImplemented");
    case "OpGlobal":
      throw new Error("NotImplemented");
    case "OpPop":
      throw new Error("NotImplemented");
    case "OpPropertyName":
      throw new Error("NotImplemented");
    case "OpRegister":
      throw new Error("NotImplemented");
    case "OpTemporary":
      throw new Error("NotImplemented");
    case "OpUndefined":
      throw new Error("NotImplemented");
    case "OpVariable":
      throw new Error("NotImplemented");
    case "SequenceExpression":
      throw new Error("NotImplemented");
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

function opCallFunction<N extends OpCallFunction>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function opCallFunction<N extends RoOpCallFunction>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined {
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
