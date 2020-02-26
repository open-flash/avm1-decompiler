import { Node, RoNode } from "../../as2-types/node";
import { OpCallFunction, RoOpCallFunction } from "../../as2-types/op-statements/op-call-function";
import { RoOpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
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
      throw new Error("NotImplemented");
    case "OpEnumerate":
      throw new Error("NotImplemented");
    case "OpInitArray":
      throw new Error("NotImplemented");
    case "OpInitObject":
      throw new Error("NotImplemented");
    case "OpPush":
      throw new Error("NotImplemented");
    case "OpTrace":
      return opTrace(parent);
    case "ReturnStatement":
      throw new Error("NotImplemented");
    case "SetVariable":
      throw new Error("NotImplemented");
    case "ThrowStatement":
      throw new Error("NotImplemented");
    case "AssignmentExpression":
      throw new Error("NotImplemented");
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
      throw new Error("NotImplemented");
    case "UnaryExpression":
      throw new Error("NotImplemented");
    case "IdentifierPattern":
      throw new Error("NotImplemented");
    case "MemberPattern":
      throw new Error("NotImplemented");
    case "OpRegisterPattern":
      throw new Error("NotImplemented");
    case "OpTemporaryPattern":
      throw new Error("NotImplemented");
    default:
      throw new Error("Unexpected Node type");
  }
}

function script<N extends Script>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function script<N extends RoScript>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
function script(parent: any): any {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.body.length) {
    return parent.node.body[nextIndex];
  } else {
    return undefined;
  }
}

function blockStatement<N extends BlockStatement>(parent: NodeParent<N>): Node<N["loc"]> | undefined;
function blockStatement<N extends RoBlockStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
function blockStatement(parent: any): any {
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
function ifFrameLoadedStatement<N extends RoIfFrameLoadedStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
function ifFrameLoadedStatement(parent: any): any {
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
function ifStatement<N extends RoIfStatement>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
function ifStatement(parent: any): any {
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
function opCallFunction<N extends RoOpCallFunction>(parent: NodeParent<N>): RoNode<N["loc"]> | undefined;
function opCallFunction(parent: any): any {
  switch (parent.key) {
    case "target":
      return parent.node.callee;
    // @ts-ignore
    case "callee":
      if (parent.node.falsy !== null) {
        return parent.node.falsy;
      }
      // Fall-through
    case "argCount":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}

function opConstantPool<N extends RoOpConstantPool>(parent: NodeParent<N>): Node<N["loc"]> | undefined {
  const nextIndex: number = parent.index + 1;
  if (nextIndex < parent.node.pool.length) {
    return parent.node.pool[nextIndex];
  } else {
    return undefined;
  }
}

function opTrace<N extends RoOpTrace>(parent: NodeParent<N>): Node<N["loc"]> | undefined {
  switch (parent.key) {
    case "value":
      return undefined;
    default:
      throw new Error("AssertionError: unexpected key");
  }
}
