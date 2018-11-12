import { ActionType, Value, ValueType } from "avm1-tree";
import { Push } from "avm1-tree/actions";
import { Expression } from "./as2-tree/expression";
import { ActionEdge, BoundEdge, Cfg, CfgEdgeType } from "./cfg";
import { PartialExpr } from "./partial-expr";

export function disassemble(avm1: Uint8Array): any {
  const cfg: Cfg = Cfg.fromAvm1(avm1);
  pushToExpr(cfg);
  return cfg;
}

function pushToExpr(cfg: Cfg): boolean {
  const pushEdges: Set<BoundEdge<ActionEdge<Push>>> = new Set();
  for (const boundEdge of cfg.iterEdges()) {
    if (boundEdge.edge.type === CfgEdgeType.Action && boundEdge.edge.action.action === ActionType.Push) {
      pushEdges.add(boundEdge as BoundEdge<ActionEdge<Push>>);
    }
  }
  if (pushEdges.size === 0) {
    return false;
  }
  for (const pushEdge of pushEdges) {
    cfg.removeEdge(pushEdge.from, pushEdge.to);
    if (pushEdge.edge.action.values.length === 0) {
      cfg.addSimpleEdge(pushEdge.from, pushEdge.to);
    } else {
      let cur: number = pushEdge.from;
      const values: ReadonlyArray<Value> = pushEdge.edge.action.values;
      for (const [i, val] of values.entries()) {
        const partialExpr: PartialExpr = {
          inputs: 0,
          expr: avm1ValueToAs2Expression(val),
          type: undefined,
        };
        if (i === values.length - 1) {
          cfg.addExpressionEdge(cur, pushEdge.to, partialExpr);
        } else {
          cur = cfg.appendExpressionEdge(cur, partialExpr);
        }
      }
    }
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
