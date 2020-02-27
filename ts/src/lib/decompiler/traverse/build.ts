import { Expression } from "../../as2-types/expression";
import { AssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { BinaryExpression } from "../../as2-types/expressions/binary-expression";
import { BooleanLiteral } from "../../as2-types/expressions/boolean-literal";
import { CallExpression } from "../../as2-types/expressions/call-expression";
import { ConditionalExpression } from "../../as2-types/expressions/conditional-expression";
import { Identifier } from "../../as2-types/expressions/identifier";
import { LogicalExpression } from "../../as2-types/expressions/logical-expression";
import { MemberExpression } from "../../as2-types/expressions/member-expression";
import { NewExpression } from "../../as2-types/expressions/new-expression";
import { NullLiteral } from "../../as2-types/expressions/null-literal";
import { NumberLiteral } from "../../as2-types/expressions/number-literal";
import { SequenceExpression } from "../../as2-types/expressions/sequence-expression";
import { StringLiteral } from "../../as2-types/expressions/string-literal";
import { UnaryExpression } from "../../as2-types/expressions/unary-expression";
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
import { OpCallFunction } from "../../as2-types/op-statements/op-call-function";
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
import { IfStatement } from "../../as2-types/statements/if-statement";
import { ReturnStatement } from "../../as2-types/statements/return-statement";
import { SetVariable } from "../../as2-types/statements/set-variable";
import { ThrowStatement } from "../../as2-types/statements/throw-statement";
import { Tree } from "../traverse";
import {
  AssignmentExpressionPath,
  BinaryExpressionPath,
  BlockStatementPath,
  BooleanLiteralPath,
  CallExpressionPath,
  ConditionalExpressionPath,
  EmptyStatementPath,
  ExpressionStatementPath,
  IdentifierPath,
  IdentifierPatternPath,
  IfFrameLoadedStatementPath,
  IfStatementPath,
  LogicalExpressionPath,
  MemberExpressionPath,
  MemberPatternPath,
  NewExpressionPath,
  NullLiteralPath,
  NumberLiteralPath,
  OpCallFunctionPath,
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
  SequenceExpressionPath,
  SetVariablePath,
  StringLiteralPath,
  ThrowStatementPath,
  UnaryExpressionPath,
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
  script(state, root);
  return state;
}

function script<L>(state: TreeState<L>, node: Script<L>): void {
  state.paths.set(node, new ScriptPath(state.tree, node));
  const key: "body" = "body";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    statement(state, child);
  }
}

function statement<L>(state: TreeState<L>, node: Statement<L>): void {
  switch (node.type) {
    case "BlockStatement":
      return blockStatement(state, node);
    case "EmptyStatement":
      return emptyStatement(state, node);
    case "ExpressionStatement":
      return expressionStatement(state, node);
    case "IfFrameLoadedStatement":
      return ifFrameLoadedStatement(state, node);
    case "IfStatement":
      return ifStatement(state, node);
    case "OpCallFunction":
      return opCallFunction(state, node);
    case "OpConstantPool":
      return opConstantPool(state, node);
    case "OpDeclareVariable":
      return opDeclareVariable(state, node);
    case "OpEnumerate":
      return opEnumerate(state, node);
    case "OpInitArray":
      return opInitArray(state, node);
    case "OpInitObject":
      return opInitObject(state, node);
    case "OpPush":
      return opPush(state, node);
    case "OpTrace":
      return opTrace(state, node);
    case "ReturnStatement":
      return returnStatement(state, node);
    case "SetVariable":
      return setVariable(state, node);
    case "ThrowStatement":
      return throwStatement(state, node);
    default:
      throw new Error("Unexpected Node type");
  }
}

function blockStatement<L>(state: TreeState<L>, node: BlockStatement<L>): void {
  state.paths.set(node, new BlockStatementPath(state.tree, node));
  const key: "body" = "body";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    statement(state, child);
  }
}

function emptyStatement<L>(state: TreeState<L>, node: EmptyStatement<L>): void {
  state.paths.set(node, new EmptyStatementPath(state.tree, node));
}

function expressionStatement<L>(state: TreeState<L>, node: ExpressionStatement<L>): void {
  state.paths.set(node, new ExpressionStatementPath(state.tree, node));
  buildKey(state, node, "expression", expression);
}

function ifFrameLoadedStatement<L>(state: TreeState<L>, node: IfFrameLoadedStatement<L>): void {
  state.paths.set(node, new IfFrameLoadedStatementPath(state.tree, node));
  buildNullableKey(state, node, "scene", expression);
  buildKey(state, node, "frame", expression);
  buildKey(state, node, "ready", statement);
  buildNullableKey(state, node, "loading", statement);
}

function ifStatement<L>(state: TreeState<L>, node: IfStatement<L>): void {
  state.paths.set(node, new IfStatementPath(state.tree, node));
  buildNullableKey(state, node, "test", expression);
  buildKey(state, node, "truthy", statement);
  buildNullableKey(state, node, "falsy", statement);
}

function opCallFunction<L>(state: TreeState<L>, node: OpCallFunction<L>): void {
  state.paths.set(node, new OpCallFunctionPath(state.tree, node));
  buildKey(state, node, "callee", expression);
  buildKey(state, node, "argCount", expression);
}

function opConstantPool<L>(state: TreeState<L>, node: OpConstantPool<L>): void {
  state.paths.set(node, new OpConstantPoolPath(state.tree, node));
  const key: "pool" = "pool";
  for (const [index, child] of node[key].entries()) {
    state.parents.set(child, {node, key, index});
    stringLiteral(state, child);
  }
}

function opDeclareVariable<L>(state: TreeState<L>, node: OpDeclareVariable<L>): void {
  state.paths.set(node, new OpDeclareVariablePath(state.tree, node));
  buildKey(state, node, "name", expression);
  {
    const key: "value" = "value";
    const child: Expression<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      expression(state, child);
    }
  }
}

function opEnumerate<L>(state: TreeState<L>, node: OpEnumerate<L>): void {
  state.paths.set(node, new OpEnumeratePath(state.tree, node));
  buildKey(state, node, "value", expression);
}

function opInitArray<L>(state: TreeState<L>, node: OpInitArray<L>): void {
  state.paths.set(node, new OpInitArrayPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: OpTemporaryPattern<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      opTemporaryPattern(state, child);
    }
  }
  buildKey(state, node, "itemCount", expression);
}

function opInitObject<L>(state: TreeState<L>, node: OpInitObject<L>): void {
  state.paths.set(node, new OpInitObjectPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: OpTemporaryPattern<L> | null = node[key];
    if (child !== null) {
      state.parents.set(child, {node, key, index: 0});
      opTemporaryPattern(state, child);
    }
  }
  buildKey(state, node, "itemCount", expression);
}

function opPush<L>(state: TreeState<L>, node: OpPush<L>): void {
  state.paths.set(node, new OpPushPath(state.tree, node));
  buildKey(state, node, "value", expression);
}

function opTrace<L>(state: TreeState<L>, node: OpTrace<L>): void {
  state.paths.set(node, new OpTracePath(state.tree, node));
  buildKey(state, node, "value", expression);
}

function returnStatement<L>(state: TreeState<L>, node: ReturnStatement<L>): void {
  state.paths.set(node, new ReturnStatementPath(state.tree, node));
  const key: "value" = "value";
  const child: Expression<L> | null = node[key];
  if (child !== null) {
    state.parents.set(child, {node, key, index: 0});
    expression(state, child);
  }
}

function setVariable<L>(state: TreeState<L>, node: SetVariable<L>): void {
  state.paths.set(node, new SetVariablePath(state.tree, node));
  buildKey(state, node, "value", expression);
  buildKey(state, node, "name", expression);
}

function throwStatement<L>(state: TreeState<L>, node: ThrowStatement<L>): void {
  state.paths.set(node, new ThrowStatementPath(state.tree, node));
  buildKey(state, node, "value", expression);
}

function expression<L>(state: TreeState<L>, node: Expression<L>): void {
  switch (node.type) {
    case "AssignmentExpression":
      return assignmentExpression(state, node);
    case "BinaryExpression":
      return binaryExpression(state, node);
    case "BooleanLiteral":
      return booleanLiteral(state, node);
    case "CallExpression":
      return callExpression(state, node);
    case "ConditionalExpression":
      return conditionalExpression(state, node);
    case "Identifier":
      return identifier(state, node);
    case "LogicalExpression":
      return logicalExpression(state, node);
    case "MemberExpression":
      return memberExpression(state, node);
    case "NewExpression":
      return newExpression(state, node);
    case "NullLiteral":
      return nullLiteral(state, node);
    case "NumberLiteral":
      return numberLiteral(state, node);
    case "OpConstant":
      return opConstant(state, node);
    case "OpGlobal":
      return opGlobal(state, node);
    case "OpPop":
      return opPop(state, node);
    case "OpPropertyName":
      return opPropertyName(state, node);
    case "OpRegister":
      return opRegister(state, node);
    case "OpTemporary":
      return opTemporary(state, node);
    case "OpUndefined":
      return opUndefined(state, node);
    case "OpVariable":
      return opVariable(state, node);
    case "SequenceExpression":
      return sequenceExpression(state, node);
    case "StringLiteral":
      return stringLiteral(state, node);
    case "UnaryExpression":
      return unaryExpression(state, node);
    default:
      throw new Error("Unexpected Node type");
  }
}

function assignmentExpression<L>(state: TreeState<L>, node: AssignmentExpression<L>): void {
  state.paths.set(node, new AssignmentExpressionPath(state.tree, node));
  {
    const key: "target" = "target";
    const child: Pattern<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    pattern(state, child);
  }
  {
    const key: "value" = "value";
    const child: Expression<L> = node[key];
    state.parents.set(child, {node, key, index: 0});
    expression(state, child);
  }
}

function binaryExpression<L>(state: TreeState<L>, node: BinaryExpression<L>): void {
  state.paths.set(node, new BinaryExpressionPath(state.tree, node));
  buildKey(state, node, "left", expression);
  buildKey(state, node, "right", expression);
}

function booleanLiteral<L>(state: TreeState<L>, node: BooleanLiteral<L>): void {
  state.paths.set(node, new BooleanLiteralPath(state.tree, node));
}

function callExpression<L>(state: TreeState<L>, node: CallExpression<L>): void {
  state.paths.set(node, new CallExpressionPath(state.tree, node));
  throw new Error("NotImplemented");
}

function conditionalExpression<L>(state: TreeState<L>, node: ConditionalExpression<L>): void {
  state.paths.set(node, new ConditionalExpressionPath(state.tree, node));
  buildKey(state, node, "test", expression);
  buildKey(state, node, "truthy", expression);
  buildKey(state, node, "falsy", expression);
}

function identifier<L>(state: TreeState<L>, node: Identifier<L>): void {
  state.paths.set(node, new IdentifierPath(state.tree, node));
}

function logicalExpression<L>(state: TreeState<L>, node: LogicalExpression<L>): void {
  state.paths.set(node, new LogicalExpressionPath(state.tree, node));
  buildKey(state, node, "left", expression);
  buildKey(state, node, "right", expression);
}

function memberExpression<L>(state: TreeState<L>, node: MemberExpression<L>): void {
  state.paths.set(node, new MemberExpressionPath(state.tree, node));
  buildKey(state, node, "base", expression);
  buildKey(state, node, "key", expression);
}

function newExpression<L>(state: TreeState<L>, node: NewExpression<L>): void {
  state.paths.set(node, new NewExpressionPath(state.tree, node));
  throw new Error("NotImplemented");
}

function nullLiteral<L>(state: TreeState<L>, node: NullLiteral<L>): void {
  state.paths.set(node, new NullLiteralPath(state.tree, node));
}

function numberLiteral<L>(state: TreeState<L>, node: NumberLiteral<L>): void {
  state.paths.set(node, new NumberLiteralPath(state.tree, node));
}

function opConstant<L>(state: TreeState<L>, node: OpConstant<L>): void {
  state.paths.set(node, new OpConstantPath(state.tree, node));
}

function opGlobal<L>(state: TreeState<L>, node: OpGlobal<L>): void {
  state.paths.set(node, new OpGlobalPath(state.tree, node));
}

function opPop<L>(state: TreeState<L>, node: OpPop<L>): void {
  state.paths.set(node, new OpPopPath(state.tree, node));
}

function opPropertyName<L>(state: TreeState<L>, node: OpPropertyName<L>): void {
  state.paths.set(node, new OpPropertyNamePath(state.tree, node));
  buildKey(state, node, "index", expression);
}

function opRegister<L>(state: TreeState<L>, node: OpRegister<L>): void {
  state.paths.set(node, new OpRegisterPath(state.tree, node));
}

function opTemporary<L>(state: TreeState<L>, node: OpTemporary<L>): void {
  state.paths.set(node, new OpTemporaryPath(state.tree, node));
}

function opUndefined<L>(state: TreeState<L>, node: OpUndefined<L>): void {
  state.paths.set(node, new OpUndefinedPath(state.tree, node));
}

function opVariable<L>(state: TreeState<L>, node: OpVariable<L>): void {
  state.paths.set(node, new OpVariablePath(state.tree, node));
  buildKey(state, node, "name", expression);
}

function sequenceExpression<L>(state: TreeState<L>, node: SequenceExpression<L>): void {
  state.paths.set(node, new SequenceExpressionPath(state.tree, node));
  throw new Error("NotImplemented");
}

function unaryExpression<L>(state: TreeState<L>, node: UnaryExpression<L>): void {
  state.paths.set(node, new UnaryExpressionPath(state.tree, node));
  buildKey(state, node, "argument", expression);
}

function stringLiteral<L>(state: TreeState<L>, node: StringLiteral<L>): void {
  state.paths.set(node, new StringLiteralPath(state.tree, node));
}

function pattern<L>(state: TreeState<L>, node: Pattern<L>): void {
  switch (node.type) {
    case "IdentifierPattern":
      return identifierPattern(state, node);
    case "MemberPattern":
      return memberPattern(state, node);
    case "OpRegisterPattern":
      return opRegisterPattern(state, node);
    case "OpTemporaryPattern":
      return opTemporaryPattern(state, node);
    default:
      throw new Error("Unexpected Node type");
  }
}

function identifierPattern<L>(state: TreeState<L>, node: IdentifierPattern<L>): void {
  state.paths.set(node, new IdentifierPatternPath(state.tree, node));
}

function memberPattern<L>(state: TreeState<L>, node: MemberPattern<L>): void {
  state.paths.set(node, new MemberPatternPath(state.tree, node));
  buildKey(state, node, "base", expression);
  buildKey(state, node, "key", expression);
}

function opRegisterPattern<L>(state: TreeState<L>, node: OpRegisterPattern<L>): void {
  state.paths.set(node, new OpRegisterPatternPath(state.tree, node));
}

function opTemporaryPattern<L>(state: TreeState<L>, node: OpTemporaryPattern<L>): void {
  state.paths.set(node, new OpTemporaryPatternPath(state.tree, node));
}

/**
 * Returns the keys `K` of `N` such that `N[K] extends Node<L>`
 */
type NodeKeys<L, N> = { [K in keyof N]: N[K] extends Node<L> ? K : never }[keyof N];

// The generic here check that `key` is a field of `node` such that `node[key]` extends `Node<L>`
function buildKey<L, N extends Node<L>, K extends NodeKeys<L, Omit<N, "loc">>>(
  state: TreeState<L>,
  node: N,
  key: K & string,
  fn: (s: TreeState<L>, n: N[K]) => void,
): void {
  const child: N[K] = node[key];
  state.parents.set(child, {node, key, index: 0});
  fn(state, child);
}

/**
 * Returns the keys `K` of `N` such that `N[K] extends Node<L> | null`
 */
type NullableNodeKeys<L, N> = { [K in keyof N]: N[K] extends (Node<L> | null) ? K : never }[keyof N];

// The generic here check that `key` is a field of `node` such that `node[key]` extends `Node<L>`
function buildNullableKey<L, N extends Node<L>, K extends NullableNodeKeys<L, Omit<N, "loc">>>(
  state: TreeState<L>,
  node: N,
  key: K & string,
  // `N[K] & Node<L>` is a workaround for `Exclude<N[K], null>` or `N[K] & not null` (not supported yet)
  fn: (s: TreeState<L>, n: N[K] & Node<L>) => void,
): void {
  const child: N[K] = node[key];
  if (child !== null) {
    state.parents.set(child, {node, key, index: 0});
    fn(state, child);
  }
}
