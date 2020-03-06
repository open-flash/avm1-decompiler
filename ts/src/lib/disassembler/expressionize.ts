import { ActionType } from "avm1-types/action-type";
import { PushValue as Value } from "avm1-types/push-value";
import { PushValueType as ValueType } from "avm1-types/push-value-type";
import { Action } from "avm1-types/raw/action";
import { Push } from "avm1-types/raw/actions/index";
import { Expression } from "../as2-types/expression";
import { UnaryOperator } from "../as2-types/unary-operator";
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
        {
          type: "UnaryExpression",
          loc: null,
          operator: UnaryOperator.LogicalNot,
          argument: {
            type: "OpTemporary",
            loc: null,
            id: 0,
          },
        },
      )];
    case ActionType.Push:
      return expressionizePush(action);
    case ActionType.Trace:
      return [createVoidExpressionEdge(
        1,
        {
          type: "CallExpression",
          loc: null,
          callee: {
            type: "Identifier",
            loc: null,
            name: "trace",
          },
          arguments: [{
            type: "OpTemporary",
            loc: null,
            id: 0,
          }],
        },
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
      return {type: "BooleanLiteral", loc: null, value: value.value};
    case ValueType.Constant:
      return {type: "OpConstant", loc: null, id: value.value};
    case ValueType.String:
      return {type: "StringLiteral", loc: null, value: value.value};
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
