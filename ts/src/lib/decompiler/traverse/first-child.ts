import { Node, RoNode } from "../../as2-types/node";

// tslint:disable:cyclomatic-complexity
export function getFirstChild<L>(node: Node<L>): Node<L> | undefined;
export function getFirstChild<L>(node: RoNode<L>): RoNode<L> | undefined;
export function getFirstChild<L>(node: RoNode<L>): RoNode<L> | undefined {
  switch (node.type) {
    case "Script":
      return node.body.length > 0 ? node.body[0] : undefined;
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
    case "OpConstantPool":
      return node.pool.length > 0 ? node.pool[0] : undefined;
    case "OpDeclareVariable":
      return node.name;
    case "OpEnumerate":
      return node.value;
    case "OpInitArray":
      return node.target !== null ? node.target : node.itemCount;
    case "OpInitObject":
      return node.target !== null ? node.target : node.itemCount;
    case "OpPush":
      return node.value;
    case "OpStackCall":
      return node.callee;
    case "OpTrace":
      return node.value;
    case "ReturnStatement":
      return node.value !== null ? node.value : undefined;
    case "SetVariable":
      return node.name;
    case "ThrowStatement":
      return node.value;
    case "AssignmentExpression":
      return node.target;
    case "BinaryExpression":
      return node.left;
    case "BooleanLiteral":
      return undefined;
    case "CallExpression":
      return node.callee;
    case "ConditionalExpression":
      return node.test;
    case "Identifier":
      return undefined;
    case "LogicalExpression":
      return node.left;
    case "MemberExpression":
      return node.base;
    case "NewExpression":
      return node.callee;
    case "NullLiteral":
      return undefined;
    case "NumberLiteral":
      return undefined;
    case "OpConstant":
      return undefined;
    case "OpGlobal":
      return undefined;
    case "OpPop":
      return undefined;
    case "OpPropertyName":
      return node.index;
    case "OpRegister":
      return undefined;
    case "OpTemporary":
      return undefined;
    case "OpUndefined":
      return undefined;
    case "OpVariable":
      return node.name;
    case "SequenceExpression":
      return node.expressions.length > 0 ? node.expressions[0] : undefined;
    case "StringLiteral":
      return undefined;
    case "UnaryExpression":
      return node.argument;
    case "IdentifierPattern":
      return undefined;
    case "MemberPattern":
      return node.base;
    case "OpRegisterPattern":
      return undefined;
    case "OpTemporaryPattern":
      return undefined;
    default:
      throw new Error("Unexpected Node type");
  }
}
