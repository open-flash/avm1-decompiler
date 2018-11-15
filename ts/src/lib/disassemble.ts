import { ActionType, Value, ValueType } from "avm1-tree";
import { Push } from "avm1-tree/actions";
import { Expression } from "./as2-tree/expression";
import { ActionEdge, BoundEdge, Cfg, EdgeType, ExpressionEdge, SimpleNode } from "./cfg";
import { reduceConstantPool } from "./constant-pool";
import { PartialExpr } from "./partial-expr";

export function disassemble(avm1: Uint8Array): any {
  const cfg: Cfg = Cfg.fromAvm1(avm1);
  reduceConstantPool(cfg, false);
  pushToExpr(cfg);
  return cfg;
}

function pushToExpr(cfg: Cfg): boolean {
  const pushEdges: Set<BoundEdge<ActionEdge<Push>>> = new Set();
  for (const boundEdge of cfg.iterEdges()) {
    if (boundEdge.edge.type === EdgeType.Action && boundEdge.edge.action.action === ActionType.Push) {
      pushEdges.add(boundEdge as BoundEdge<ActionEdge<Push>>);
    }
  }
  if (pushEdges.size === 0) {
    return false;
  }
  for (const pushEdge of pushEdges) {
    const edges: ExpressionEdge[] = [];
    const values: ReadonlyArray<Value> = pushEdge.edge.action.values;
    for (const value of values) {
      const expression: PartialExpr = {
        inputs: 0,
        expr: avm1ValueToAs2Expression(value),
        type: undefined,
      };
      edges.push({type: EdgeType.Expression, expression});
    }

    cfg.replaceOutEdge(pushEdge.from as SimpleNode, edges);
  }
  return true;
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
