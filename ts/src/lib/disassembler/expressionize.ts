import { Action, ActionType, Value, ValueType } from "avm1-tree";
import { Push } from "avm1-tree/actions";
import { makeCallExpression } from "../as2-tree/call-expression";
import { Expression } from "../as2-tree/expression";
import { makeIdentifier } from "../as2-tree/identifier";
import { makeInput } from "../as2-tree/partial/input";
import { makeUnaryExpression } from "../as2-tree/unary-expression";
import { UnaryOperator } from "../as2-tree/unary-operator";
import { Cfg } from "../cfg/cfg";
import { EdgeType, ExpressionEdge } from "../cfg/edge";
import { NodeType, SimpleNode } from "../cfg/node";

export function expressionize(cfg: Cfg): boolean {
  const replacements: Map<SimpleNode, ReadonlyArray<ExpressionEdge>> = new Map();

  for (const {from, edge} of cfg.iterEdges()) {
    if (from.type === NodeType.Simple && edge.type === EdgeType.Action) {
      const replacement: ReadonlyArray<ExpressionEdge> | undefined = expressionizeAction(edge.action);
      if (replacement !== undefined) {
        replacements.set(from, replacement);
      }
    }
  }
  if (replacements.size === 0) {
    return false;
  }
  for (const [from, newEdges] of replacements) {
    cfg.replaceOutEdge(from, newEdges);
  }
  return true;

}

function expressionizeAction(action: Action): ExpressionEdge[] | undefined {
  switch (action.action) {
    case ActionType.Not:
      return [createExpressionEdge(
        1,
        makeUnaryExpression(UnaryOperator.LogicalNot, makeInput(0)),
      )];
    case ActionType.Push:
      return expressionizePush(action);
    case ActionType.Trace:
      return [createVoidExpressionEdge(
        1,
        makeCallExpression(makeIdentifier("trace"), [makeInput(0)]),
      )];
    default:
      return undefined;
  }
}

function expressionizePush(action: Push): ExpressionEdge[] {
  const edges: ExpressionEdge[] = [];
  for (const value of action.values) {
    edges.push(createExpressionEdge(0, avm1ValueToAs2Expression(value)));
  }

  return edges;
}

function avm1ValueToAs2Expression(value: Value): Expression {
  switch (value.type) {
    case ValueType.Boolean:
      return {type: "boolean-literal", value: value.value};
    case ValueType.Constant:
      return {type: "_constant", id: value.value};
    case ValueType.String:
      return {type: "string-literal", value: value.value};
    default:
      throw new Error(`Unknown ValueType variant: ${value.type}`);
  }
}

function createExpressionEdge(inputs: number, expression: Expression): ExpressionEdge {
  return {
    type: EdgeType.Expression,
    expression: {
      inputs,
      expr: expression,
      void: false,
      type: undefined,
    },
  };
}

function createVoidExpressionEdge(inputs: number, expression: Expression): ExpressionEdge {
  return {
    type: EdgeType.Expression,
    expression: {
      inputs,
      expr: expression,
      void: true,
      type: undefined,
    },
  };
}
