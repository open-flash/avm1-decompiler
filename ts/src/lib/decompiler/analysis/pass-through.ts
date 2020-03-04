import { RoAssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { RoBinaryExpression } from "../../as2-types/expressions/binary-expression";
import { RoCallExpression } from "../../as2-types/expressions/call-expression";
import { RoMemberExpression } from "../../as2-types/expressions/member-expression";
import { RoNewExpression } from "../../as2-types/expressions/new-expression";
import { RoUnaryExpression } from "../../as2-types/expressions/unary-expression";
import { RoNode } from "../../as2-types/node";
import { RoOpPropertyName } from "../../as2-types/op-expressions/op-property-name";
import { RoOpVariable } from "../../as2-types/op-expressions/op-variable";
import { RoOpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { RoOpInitArray } from "../../as2-types/op-statements/op-init-array";
import { RoOpInitObject } from "../../as2-types/op-statements/op-init-object";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { RoMemberPattern } from "../../as2-types/patterns/member-pattern";
import { RoScript } from "../../as2-types/script";
import { RoBlockStatement } from "../../as2-types/statements/block-statement";
import { RoExpressionStatement } from "../../as2-types/statements/expression-statement";
import { RoReturnStatement } from "../../as2-types/statements/return-statement";
import { RoSetVariable } from "../../as2-types/statements/set-variable";
import { FlowAnalyzer } from "./analyzer";

// tslint:disable:cyclomatic-complexity

export function passThrough<T>(
  analyzer: FlowAnalyzer<T>,
  node: RoNode,
  input: T,
): T {
  switch (node.type) {
    case "Script":
      return script(analyzer, node, input);
    case "BlockStatement":
      return blockStatement(analyzer, node, input);
    case "EmptyStatement":
      return input;
    case "ExpressionStatement":
      return expressionStatement(analyzer, node, input);
    case "IfFrameLoadedStatement":
      throw new Error("NotImplemented");
    case "IfStatement":
      throw new Error("NotImplemented");
    case "OpConstantPool":
      return input;
    case "OpDeclareVariable":
      return opDeclareVariable(analyzer, node, input);
    case "OpEnumerate":
      throw new Error("NotImplemented");
    case "OpInitArray":
      return opInitArray(analyzer, node, input);
    case "OpInitObject":
      return opInitObject(analyzer, node, input);
    case "OpPush":
      return opPush(analyzer, node, input);
    case "OpTrace":
      return opTrace(analyzer, node, input);
    case "ReturnStatement":
      return returnStatement(analyzer, node, input);
    case "SetVariable":
      return setVariable(analyzer, node, input);
    case "OpStackCall":
      throw new Error("NotImplemented");
    case "ThrowStatement":
      throw new Error("NotImplemented");
    case "AssignmentExpression":
      return assignmentExpression(analyzer, node, input);
    case "BinaryExpression":
      return binaryExpression(analyzer, node, input);
    case "BooleanLiteral":
      return input;
    case "CallExpression":
      return callExpression(analyzer, node, input);
    case "ConditionalExpression":
      throw new Error("NotImplemented");
    case "Identifier":
      return input;
    case "LogicalExpression":
      throw new Error("NotImplemented");
    case "MemberExpression":
      return memberExpression(analyzer, node, input);
    case "NewExpression":
      return newExpression(analyzer, node, input);
    case "NullLiteral":
      return input;
    case "NumberLiteral":
      return input;
    case "OpConstant":
      return input;
    case "OpGlobal":
      return input;
    case "OpPop":
      return input;
    case "OpPropertyName":
      return opPropertyName(analyzer, node, input);
    case "OpRegister":
      return input;
    case "OpTemporary":
      return input;
    case "OpUndefined":
      return input;
    case "OpVariable":
      return opVariable(analyzer, node, input);
    case "SequenceExpression":
      throw new Error("NotImplemented");
    case "StringLiteral":
      return input;
    case "UnaryExpression":
      return unaryExpression(analyzer, node, input);
    case "IdentifierPattern":
      return input;
    case "MemberPattern":
      return memberPattern(analyzer, node, input);
    case "OpRegisterPattern":
      return input;
    case "OpTemporaryPattern":
      return input;
    default:
      throw new Error("UnexpectedNodeType");
  }
}

function script<T>(analyzer: FlowAnalyzer<T>, node: RoScript, input: T): T {
  for (const statement of node.body) {
    input = analyzer.transfer(statement, input);
  }
  return input;
}

function blockStatement<T>(analyzer: FlowAnalyzer<T>, node: RoBlockStatement, input: T): T {
  for (const statement of node.body) {
    input = analyzer.transfer(statement, input);
  }
  return input;
}

function expressionStatement<T>(analyzer: FlowAnalyzer<T>, node: RoExpressionStatement, input: T): T {
  input = analyzer.transfer(node.expression, input);
  return input;
}

function opDeclareVariable<T>(analyzer: FlowAnalyzer<T>, node: RoOpDeclareVariable, input: T): T {
  input = analyzer.transfer(node.name, input);
  if (node.value !== null) {
    input = analyzer.transfer(node.name, input);
  }
  return input;
}

function opInitArray<T>(analyzer: FlowAnalyzer<T>, node: RoOpInitArray, input: T): T {
  if (node.target !== null) {
    input = analyzer.transfer(node.target, input);
  }
  input = analyzer.transfer(node.itemCount, input);
  return input;
}

function opInitObject<T>(analyzer: FlowAnalyzer<T>, node: RoOpInitObject, input: T): T {
  if (node.target !== null) {
    input = analyzer.transfer(node.target, input);
  }
  input = analyzer.transfer(node.itemCount, input);
  return input;
}

function opPush<T>(analyzer: FlowAnalyzer<T>, node: RoOpPush, input: T): T {
  input = analyzer.transfer(node.value, input);
  return input;
}

function opTrace<T>(analyzer: FlowAnalyzer<T>, node: RoOpTrace, input: T): T {
  input = analyzer.transfer(node.value, input);
  return input;
}

function returnStatement<T>(analyzer: FlowAnalyzer<T>, node: RoReturnStatement, input: T): T {
  if (node.value !== null) {
    input = analyzer.transfer(node.value, input);
  }
  return input;
}

function setVariable<T>(analyzer: FlowAnalyzer<T>, node: RoSetVariable, input: T): T {
  input = analyzer.transfer(node.name, input);
  input = analyzer.transfer(node.value, input);
  return input;
}

function assignmentExpression<T>(analyzer: FlowAnalyzer<T>, node: RoAssignmentExpression, input: T): T {
  input = analyzer.transfer(node.target, input);
  input = analyzer.transfer(node.value, input);
  return input;
}

function binaryExpression<T>(analyzer: FlowAnalyzer<T>, node: RoBinaryExpression, input: T): T {
  input = analyzer.transfer(node.left, input);
  input = analyzer.transfer(node.right, input);
  return input;
}

function callExpression<T>(analyzer: FlowAnalyzer<T>, node: RoCallExpression, input: T): T {
  input = analyzer.transfer(node.callee, input);
  for (const arg of node.arguments) {
    input = analyzer.transfer(arg, input);
  }
  return input;
}

function memberExpression<T>(analyzer: FlowAnalyzer<T>, node: RoMemberExpression, input: T): T {
  input = analyzer.transfer(node.base, input);
  input = analyzer.transfer(node.key, input);
  return input;
}

function newExpression<T>(analyzer: FlowAnalyzer<T>, node: RoNewExpression, input: T): T {
  input = analyzer.transfer(node.callee, input);
  for (const arg of node.arguments) {
    input = analyzer.transfer(arg, input);
  }
  return input;
}

function opPropertyName<T>(analyzer: FlowAnalyzer<T>, node: RoOpPropertyName, input: T): T {
  input = analyzer.transfer(node.index, input);
  return input;
}

function opVariable<T>(analyzer: FlowAnalyzer<T>, node: RoOpVariable, input: T): T {
  input = analyzer.transfer(node.name, input);
  return input;
}

function unaryExpression<T>(analyzer: FlowAnalyzer<T>, node: RoUnaryExpression, input: T): T {
  input = analyzer.transfer(node.argument, input);
  return input;
}

function memberPattern<T>(analyzer: FlowAnalyzer<T>, node: RoMemberPattern, input: T): T {
  input = analyzer.transfer(node.base, input);
  input = analyzer.transfer(node.key, input);
  return input;
}
