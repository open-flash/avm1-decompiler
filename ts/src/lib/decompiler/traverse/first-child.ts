import { Node, RoNode } from "../../as2-types/node";

// tslint:disable:cyclomatic-complexity
export function getFirstChild<N extends Node>(node: N): Node<N["loc"]> | undefined;
export function getFirstChild<N extends RoNode>(node: N): RoNode<N["loc"]> | undefined;
export function getFirstChild(node: any): any {
  switch (node.type) {
    case "Script":
      return node.body[0];
    case "BlockStatement":
      return node.body[0];
    case "EmptyStatement":
      return undefined;
    case "ExpressionStatement":
      return node.expression;
    case "IfFrameLoadedStatement":
      return node.scene !== null ? node.scene : node.frame;
    case "IfStatement":
      return node.test;
    case "OpCallFunction":
      return node.callee;
    case "OpConstantPool":
      return node.pool.length > 0 ? node.pool[0] : undefined;
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
      return node.value;
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
