import { Action, ActionType, Value, ValueType } from "avm1-tree";
import { analyze, DataFlowAnalyzer } from "./data-flow-analysis";
import { Cfg } from "./cfg/cfg";
import { Node, NodeType } from "./cfg/node";
import { Edge, EdgeType } from "./cfg/edge";

export const CP_STATE_ANY: unique symbol = Symbol("CONSTANT_POOL_STATE_ANY");
export const CP_STATE_UNINITIALIZED: unique symbol = Symbol("CONSTANT_POOL_STATE_UNINITIALIZED");

export type CpState = Set<ReadonlyArray<string>> | typeof CP_STATE_ANY | typeof CP_STATE_UNINITIALIZED;

export function reduceConstantPool(cfg: Cfg, strict: boolean): boolean {
  const cpAnalyzer: ConstantPoolAnalyzer = new ConstantPoolAnalyzer(strict);
  const constantPools: Map<Node, CpState> = analyze<CpState>(cfg, cpAnalyzer);
  let changed: boolean = false;
  for (const {from, edge} of cfg.iterEdges()) {
    const state: CpState | undefined = constantPools.get(from);
    if (state === undefined || from.type !== NodeType.Simple) {
      continue;
    }
    const newEdge: Edge = replaceEdge(edge, state);
    if (newEdge !== edge) {
      cfg.replaceOutEdge(from, [newEdge]);
      changed = true;
    }
  }
  return changed;
}

function replaceEdge(edge: Edge, state: CpState): Edge {
  if (!(state instanceof Set)) {
    return edge;
  }
  const pools: ReadonlyArray<ReadonlyArray<string>> = [...state];
  if (pools.length !== 1) {
    return edge;
  }
  const pool: ReadonlyArray<string> = pools[0];

  switch (edge.type) {
    case EdgeType.Action:
      const action: Action = replaceAction(edge.action, pool);
      return action === edge.action ? edge : {...edge, action};
    case EdgeType.IfFalse:
    case EdgeType.IfTest:
    case EdgeType.IfTrue:
    case EdgeType.Simple:
      return edge;
    default:
      throw new Error(`Unknown EdgeType: ${edge.type}`);
  }
}

function replaceAction(action: Action, pool: ReadonlyArray<string>): Action {
  switch (action.action) {
    case ActionType.Push:
      if (action.values.some(v => v.type === ValueType.Constant)) {
        const values: Value[] = [];
        for (const value of action.values) {
          if (value.type !== ValueType.Constant) {
            values.push(value);
          } else if (value.value < pool.length) {
            values.push({type: ValueType.String, value: pool[value.value]});
          } else {
            values.push({type: ValueType.Undefined});
          }
        }
        return {...action, values};
      } else {
        return action;
      }
    default:
      return action;
  }
}

export class ConstantPoolAnalyzer implements DataFlowAnalyzer<CpState> {
  public readonly strict: boolean;

  constructor(strict: boolean) {
    this.strict = strict;
  }

  initialize(node: Node, cfg: Cfg): CpState {
    return CP_STATE_UNINITIALIZED;
  }

  equals(left: CpState, right: CpState): boolean {
    if (right === CP_STATE_ANY || right === CP_STATE_UNINITIALIZED) {
      return left === right;
    } else if (left === CP_STATE_ANY || left === CP_STATE_UNINITIALIZED) {
      return false;
    } else if (left.size !== right.size) {
      return false;
    } else {
      const union: Set<ReadonlyArray<string>> = new Set();
      for (const pool of left) {
        union.add(pool);
      }
      for (const pool of right) {
        union.add(pool);
      }
      return union.size === right.size;
    }
  }

  join(states: ReadonlyArray<CpState>): CpState {
    if (states.length === 0) {
      return CP_STATE_ANY;
    } else if (states.length === 1) {
      return states[0];
    } else {
      let allUnitialized: boolean = true;
      const result: Set<ReadonlyArray<string>> = new Set();
      for (const state of states) {
        if (state === CP_STATE_ANY) {
          return CP_STATE_ANY;
        } else if (state !== CP_STATE_UNINITIALIZED) {
          allUnitialized = false;
          for (const pool of state) {
            result.add(pool);
          }
        }
      }
      return allUnitialized ? CP_STATE_UNINITIALIZED : result;
    }
  }

  transfer(edge: Edge, input: CpState): CpState {
    const update: ConstantPoolUpdate = edgeToConstantPoolUpdate(edge, this.strict);
    switch (update.type) {
      case UpdateType.Set:
        return new Set([update.value]);
      case UpdateType.None:
        return input;
      case UpdateType.Unknown:
        return CP_STATE_ANY;
      default:
        throw new Error("Unexpected UpdateType value");
    }
  }
}

function edgeToConstantPoolUpdate(edge: Edge, strict: boolean): ConstantPoolUpdate {
  // TODO: Handle function calls, nested graphs, etc.
  switch (edge.type) {
    case EdgeType.Action:
      switch (edge.action.action) {
        case ActionType.ConstantPool:
          return {type: UpdateType.Set, value: edge.action.constantPool};
        default:
          return strict ? {type: UpdateType.Unknown} : {type: UpdateType.None};
      }
    case EdgeType.IfFalse:
    case EdgeType.IfTest:
    case EdgeType.IfTrue:
    case EdgeType.Simple:
      return {type: UpdateType.None};
    default:
      return {type: UpdateType.Unknown};
  }
}

type ConstantPoolUpdate = NoneConstantPoolUpdate | SetConstantPoolUpdate | UnknownConstantPoolUpdate;

enum UpdateType {
  None,
  Set,
  Unknown,
}

interface NoneConstantPoolUpdate {
  type: UpdateType.None;
}

interface SetConstantPoolUpdate {
  type: UpdateType.Set;
  value: ReadonlyArray<string>;
}

interface UnknownConstantPoolUpdate {
  type: UpdateType.Unknown;
}
