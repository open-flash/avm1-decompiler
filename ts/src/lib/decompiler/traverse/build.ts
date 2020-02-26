import { Expression } from "../../as2-types/expression";
import { Node, RoNode } from "../../as2-types/node";
import { OpTrace } from "../../as2-types/op-statements/op-trace";
import { Script } from "../../as2-types/script";
import { Statement } from "../../as2-types/statement";
import { BlockStatement } from "../../as2-types/statements/block-statement";
import { NodeParent } from "./tree-state";

export interface TreeState<L = unknown> {
  root: Script<L>;
  parents: WeakMap<RoNode<L>, NodeParent<Node<L>>>;
}

export function buildTreeState<L>(root: Script<L>): TreeState<L> {
  const state: TreeState<L> = {
    root,
    parents: new WeakMap(),
  };
  buildScript(state, root);
  return state;
}

function buildScript<L>(state: TreeState<L>, node: Script<L>): void {
  const key: "body" = "body";
  for (const [index, statement] of node[key].entries()) {
    state.parents.set(statement, {node, key, index});
    buildStatement(state, statement);
  }
}

function buildStatement<L>(state: TreeState<L>, node: Statement<L>): void {
  switch (node.type) {
    case "BlockStatement":
      return buildBlockStatement(state, node);
    case "EmptyStatement":
      throw new Error("NotImplemented");
    case "ExpressionStatement":
      throw new Error("NotImplemented");
    case "IfFrameLoadedStatement":
      throw new Error("NotImplemented");
    case "IfStatement":
      throw new Error("NotImplemented");
    case "OpCallFunction":
      throw new Error("NotImplemented");
    case "OpConstantPool":
      throw new Error("NotImplemented");
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
      return buildOpTrace(state, node);
    case "ReturnStatement":
      throw new Error("NotImplemented");
    case "SetVariable":
      throw new Error("NotImplemented");
    case "ThrowStatement":
      throw new Error("NotImplemented");
    default:
      throw new Error("Unexpected Node type");
  }
}

function buildBlockStatement<L>(state: TreeState<L>, node: BlockStatement<L>): void {
  const key: "body" = "body";
  for (const [index, statement] of node[key].entries()) {
    state.parents.set(statement, {node, key, index});
    buildStatement(state, statement);
  }
}

function buildOpTrace<L>(state: TreeState<L>, node: OpTrace<L>): void {
  const key: "value" = "value";
  const child: Expression<L> = node[key];
  state.parents.set(child, {node, key, index: 0});
  buildExpression(state, child);
}

function buildExpression<L>(_state: TreeState<L>, _node: Expression<L>): void {
  throw new Error("NotImplemented");
}
