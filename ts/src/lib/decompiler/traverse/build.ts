import { Expression } from "../../as2-types/expression";
import { AssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { StringLiteral } from "../../as2-types/expressions/string-literal";
import { Node, RoNode } from "../../as2-types/node";
import { OpConstant } from "../../as2-types/op-expressions/op-constant";
import { OpGlobal } from "../../as2-types/op-expressions/op-global";
import { OpPop } from "../../as2-types/op-expressions/op-pop";
import { OpPropertyName } from "../../as2-types/op-expressions/op-property-name";
import { OpRegister } from "../../as2-types/op-expressions/op-register";
import { OpTemporary } from "../../as2-types/op-expressions/op-temporary";
import { OpUndefined } from "../../as2-types/op-expressions/op-undefined";
import { OpVariable } from "../../as2-types/op-expressions/op-variable";
import { OpRegisterPattern } from "../../as2-types/op-patterns/op-register-pattern";
import { OpTemporaryPattern } from "../../as2-types/op-patterns/op-temporary-pattern";
import { OpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { OpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { OpEnumerate } from "../../as2-types/op-statements/op-enumerate";
import { OpInitArray } from "../../as2-types/op-statements/op-init-array";
import { OpInitObject } from "../../as2-types/op-statements/op-init-object";
import { OpPush } from "../../as2-types/op-statements/op-push";
import { OpTrace } from "../../as2-types/op-statements/op-trace";
import { Pattern } from "../../as2-types/pattern";
import { IdentifierPattern } from "../../as2-types/patterns/identifier-pattern";
import { MemberPattern } from "../../as2-types/patterns/member-pattern";
import { Script } from "../../as2-types/script";
import { Statement } from "../../as2-types/statement";
import { BlockStatement } from "../../as2-types/statements/block-statement";
import { EmptyStatement } from "../../as2-types/statements/empty-statement";
import { ExpressionStatement } from "../../as2-types/statements/expression-statement";
import { IfFrameLoadedStatement } from "../../as2-types/statements/if-frame-loaded-statement";
import { ReturnStatement } from "../../as2-types/statements/return-statement";
import { SetVariable } from "../../as2-types/statements/set-variable";
import { ThrowStatement } from "../../as2-types/statements/throw-statement";
import { Tree } from "../traverse";
import {
  AssignmentExpressionPath,
  BlockStatementPath,
  EmptyStatementPath,
  ExpressionStatementPath,
  IdentifierPatternPath,
  IfFrameLoadedStatementPath,
  MemberPatternPath,
  OpConstantPath,
  OpConstantPoolPath,
  OpDeclareVariablePath,
  OpEnumeratePath,
  OpGlobalPath,
  OpInitArrayPath,
  OpInitObjectPath,
  OpPopPath,
  OpPropertyNamePath,
  OpPushPath,
  OpRegisterPath,
  OpRegisterPatternPath,
  OpTemporaryPath,
  OpTemporaryPatternPath,
  OpTracePath,
  OpUndefinedPath,
  OpVariablePath,
  Path,
  ReturnStatementPath,
  ScriptPath,
  SetVariablePath,
  StringLiteralPath,
  ThrowStatementPath,
} from "./path";
import { NodeParent } from "./tree-state";

export interface TreeState<L = unknown> {
  tree: Tree<L>;
  root: Script<L>;
  parents: WeakMap<RoNode<L>, NodeParent<Node<L>>>;
  paths: WeakMap<RoNode<L>, Path<RoNode<L>>>;
}

export function buildTreeState<L>(tree: Tree<L>, root: Script<L>): TreeState<L> {
  const state: TreeState<L> = {
    tree,
    root,
    parents: new WeakMap(),
    paths: new WeakMap(),
  };
  buildScript(state, root);
  return state;
}

function buildScript<L>(state: TreeState<L>, node: Script<L>): void {
  state.paths.set(node, new ScriptPath(state.tree, node));
  const key: "body" = "body";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    buildStatement(state, child);
  }
}

function buildStatement<L>(state: TreeState<L>, node: Statement<L>): void {
  switch (node.type) {
    case "BlockStatement":
      return buildBlockStatement(state, node);
    case "EmptyStatement":
      return buildEmptyStatement(state, node);
    case "ExpressionStatement":
      return buildExpressionStatement(state, node);
    case "IfFrameLoadedStatement":
      return buildIfFrameLoadedStatement(state, node);
    case "IfStatement":
      throw new Error("NotImplemented");
    case "OpCallFunction":
      throw new Error("NotImplemented");
    case "OpConstantPool":
      return buildOpConstantPool(state, node);
    case "OpDeclareVariable":
      return buildOpDeclareVariable(state, node);
    case "OpEnumerate":
      return buildOpEnumerate(state, node);
    case "OpInitArray":
      return buildOpInitArray(state, node);
    case "OpInitObject":
      return buildOpInitObject(state, node);
    case "OpPush":
      return buildOpPush(state, node);
    case "OpTrace":
      return buildOpTrace(state, node);
    case "ReturnStatement":
      return buildReturnStatement(state, node);
    case "SetVariable":
      return buildSetVariable(state, node);
    case "ThrowStatement":
      return buildThrowStatement(state, node);
    default:
      throw new Error("Unexpected Node type");
  }
}

function buildBlockStatement<L>(state: TreeState<L>, node: BlockStatement<L>): void {
  state.paths.set(node, new BlockStatementPath(state.tree, node));
  const key: "body" = "body";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    buildStatement(state, child);
  }
}

function buildEmptyStatement<L>(state: TreeState<L>, node: EmptyStatement<L>): void {
  state.paths.set(node, new EmptyStatementPath(state.tree, node));
}

function buildExpressionStatement<L>(state: TreeState<L>, node: ExpressionStatement<L>): void {
  state.paths.set(node, new ExpressionStatementPath(state.tree, node));
  const key: "expression" = "expression";
  const child: Expression<L> = node[key];
  state.parents.set(child, {node, key, index: 0});
  buildExpression(state, child);
}

function buildIfFrameLoadedStatement<L>(state: TreeState<L>, node: IfFrameLoadedStatement<L>): void {
  state.paths.set(node, new IfFrameLoadedStatementPath(state.tree, node));
  {
    const key: "scene" = "scene";
    const child: Expression<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      buildExpression(state, child);
    }
  }
  {
    const key: "frame" = "frame";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
  {
    const key: "ready" = "ready";
    const child: Statement<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildStatement(state, child);
  }
  {
    const key: "loading" = "loading";
    const child: Statement<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      buildStatement(state, child);
    }
  }
}

function buildOpConstantPool<L>(state: TreeState<L>, node: OpConstantPool<L>): void {
  state.paths.set(node, new OpConstantPoolPath(state.tree, node));
  const key: "pool" = "pool";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    buildStringLiteral(state, child);
  }
}

function buildOpDeclareVariable<L>(state: TreeState<L>, node: OpDeclareVariable<L>): void {
  state.paths.set(node, new OpDeclareVariablePath(state.tree, node));
  {
    const key: "name" = "name";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
  {
    const key: "value" = "value";
    const child: Expression<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      buildExpression(state, child);
    }
  }
}

function buildOpEnumerate<L>(state: TreeState<L>, node: OpEnumerate<L>): void {
  state.paths.set(node, new OpEnumeratePath(state.tree, node));
  {
    const key: "value" = "value";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpInitArray<L>(state: TreeState<L>, node: OpInitArray<L>): void {
  state.paths.set(node, new OpInitArrayPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: OpTemporaryPattern<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      buildOpTemporaryPattern(state, child);
    }
  }
  {
    const key: "itemCount" = "itemCount";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpInitObject<L>(state: TreeState<L>, node: OpInitObject<L>): void {
  state.paths.set(node, new OpInitObjectPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: OpTemporaryPattern<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      buildOpTemporaryPattern(state, child);
    }
  }
  {
    const key: "itemCount" = "itemCount";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpPush<L>(state: TreeState<L>, node: OpPush<L>): void {
  state.paths.set(node, new OpPushPath(state.tree, node));
  {
    const key: "value" = "value";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpTrace<L>(state: TreeState<L>, node: OpTrace<L>): void {
  state.paths.set(node, new OpTracePath(state.tree, node));
  const key: "value" = "value";
  const child: Expression<L> = node[key];
  state.parents.set(child, {node, key, index: 0});
  buildExpression(state, child);
}

function buildReturnStatement<L>(state: TreeState<L>, node: ReturnStatement<L>): void {
  state.paths.set(node, new ReturnStatementPath(state.tree, node));
  const key: "value" = "value";
  const child: Expression<L> | null = node[key];
  if (child !== null) {
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildSetVariable<L>(state: TreeState<L>, node: SetVariable<L>): void {
  state.paths.set(node, new SetVariablePath(state.tree, node));
  {
    const key: "value" = "value";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
  {
    const key: "name" = "name";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildThrowStatement<L>(state: TreeState<L>, node: ThrowStatement<L>): void {
  state.paths.set(node, new ThrowStatementPath(state.tree, node));
  const key: "value" = "value";
  const child: Expression<L> = node[key];
  state.parents.set(child, {node, key, index: 0});
  buildExpression(state, child);
}

function buildExpression<L>(state: TreeState<L>, node: Expression<L>): void {
  switch (node.type) {
    case "AssignmentExpression":
      return buildAssignmentExpression(state, node);
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
      return buildOpConstant(state, node);
    case "OpGlobal":
      return buildOpGlobal(state, node);
    case "OpPop":
      return buildOpPop(state, node);
    case "OpPropertyName":
      return buildOpPropertyName(state, node);
    case "OpRegister":
      return buildOpRegister(state, node);
    case "OpTemporary":
      return buildOpTemporary(state, node);
    case "OpUndefined":
      return buildOpUndefined(state, node);
    case "OpVariable":
      return buildOpVariable(state, node);
    case "SequenceExpression":
      throw new Error("NotImplemented");
    case "StringLiteral":
      return buildStringLiteral(state, node);
    case "UnaryExpression":
      throw new Error("NotImplemented");
    default:
      throw new Error("Unexpected Node type");
  }
}

function buildAssignmentExpression<L>(state: TreeState<L>, node: AssignmentExpression<L>): void {
  state.paths.set(node, new AssignmentExpressionPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: Pattern<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildPattern(state, child);
  }
  {
    const key: "value" = "value";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpConstant<L>(state: TreeState<L>, node: OpConstant<L>): void {
  state.paths.set(node, new OpConstantPath(state.tree, node));
}

function buildOpGlobal<L>(state: TreeState<L>, node: OpGlobal<L>): void {
  state.paths.set(node, new OpGlobalPath(state.tree, node));
}

function buildOpPop<L>(state: TreeState<L>, node: OpPop<L>): void {
  state.paths.set(node, new OpPopPath(state.tree, node));
}

function buildOpPropertyName<L>(state: TreeState<L>, node: OpPropertyName<L>): void {
  state.paths.set(node, new OpPropertyNamePath(state.tree, node));
  {
    const key: "index" = "index";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpRegister<L>(state: TreeState<L>, node: OpRegister<L>): void {
  state.paths.set(node, new OpRegisterPath(state.tree, node));
}

function buildOpTemporary<L>(state: TreeState<L>, node: OpTemporary<L>): void {
  state.paths.set(node, new OpTemporaryPath(state.tree, node));
}

function buildOpUndefined<L>(state: TreeState<L>, node: OpUndefined<L>): void {
  state.paths.set(node, new OpUndefinedPath(state.tree, node));
}

function buildOpVariable<L>(state: TreeState<L>, node: OpVariable<L>): void {
  state.paths.set(node, new OpVariablePath(state.tree, node));
  {
    const key: "name" = "name";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildStringLiteral<L>(state: TreeState<L>, node: StringLiteral<L>): void {
  state.paths.set(node, new StringLiteralPath(state.tree, node));
}

function buildPattern<L>(state: TreeState<L>, node: Pattern<L>): void {
  switch (node.type) {
    case "IdentifierPattern":
      return buildIdentifierPattern(state, node);
    case "MemberPattern":
      return buildMemberPattern(state, node);
    case "OpRegisterPattern":
      return buildOpRegisterPattern(state, node);
    case "OpTemporaryPattern":
      return buildOpTemporaryPattern(state, node);
    default:
      throw new Error("Unexpected Node type");
  }
}

function buildIdentifierPattern<L>(state: TreeState<L>, node: IdentifierPattern<L>): void {
  state.paths.set(node, new IdentifierPatternPath(state.tree, node));
}

function buildMemberPattern<L>(state: TreeState<L>, node: MemberPattern<L>): void {
  state.paths.set(node, new MemberPatternPath(state.tree, node));
  {
    const key: "base" = "base";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
  {
    const key: "key" = "key";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    buildExpression(state, child);
  }
}

function buildOpRegisterPattern<L>(state: TreeState<L>, node: OpRegisterPattern<L>): void {
  state.paths.set(node, new OpRegisterPatternPath(state.tree, node));
}

function buildOpTemporaryPattern<L>(state: TreeState<L>, node: OpTemporaryPattern<L>): void {
  state.paths.set(node, new OpTemporaryPatternPath(state.tree, node));
}
