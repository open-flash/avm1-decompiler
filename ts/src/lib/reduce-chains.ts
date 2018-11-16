import { Cfg } from "./cfg/cfg";
import { Edge, EdgeType } from "./cfg/edge";
import { Node, NodeType, SimpleNode } from "./cfg/node";
import { mergePartialExpressions, PartialExpr } from "./partial-expr";

export function reduceChains(cfg: Cfg): boolean {
  const replacements: Map<ReadonlyArray<SimpleNode>, ReadonlyArray<Edge>> = new Map();

  for (const chain of iterChains(cfg)) {
    const newEdges: ReadonlyArray<Edge> | undefined = reduceChain(chain);
    if (newEdges !== undefined) {
      replacements.set(chain, newEdges);
    }
  }
  if (replacements.size === 0) {
    return false;
  }
  for (const [chain, newEdges] of replacements) {
    cfg.replaceChain(chain, newEdges);
  }
  return true;
}

function* iterChains(cfg: Cfg): IterableIterator<SimpleNode[]> {
  const visitedState: Map<Node, boolean> = new Map();
  const stack: Node[] = [cfg.getSource()];
  while (stack.length > 0) {
    let cur: Node = stack.pop()!;
    visitedState.set(cur, true);
    if (cur.type === NodeType.Simple) {
      const chain: SimpleNode[] = [];
      while (cur.type === NodeType.Simple) {
        chain.push(cur);
        visitedState.set(cur, true);
        if (cfg.getInDegree(cur.out.to) !== 1) {
          break;
        }
        // TODO: avoid source or already visited nodes (don't break on loop)
        cur = cur.out.to;
      }
      yield chain;
    }
    for (const {to} of cfg.getOutEdges(cur)) {
      if (!visitedState.has(to)) {
        stack.push(to);
        visitedState.set(to, false);
      }
    }
  }
}

function reduceChain(chain: ReadonlyArray<SimpleNode>): Edge[] | undefined {
  const newEdges: Edge[] = [];
  let prev: Edge | undefined = undefined;
  let changed: boolean = false;
  for (const [i, link] of chain.entries()) {
    const edge: Edge = link.out.edge;
    if (prev === undefined) {
      prev = edge;
      continue;
    }
    const reduced: Edge | undefined = mergeEdges(prev, edge);
    if (reduced === undefined) {
      newEdges.push(prev);
      prev = edge;
    } else {
      changed = true;
      prev = reduced;
    }
    if (i === chain.length - 1) {
      newEdges.push(prev);
    }
  }
  return changed ? newEdges : undefined;
}

function mergeEdges(first: Edge, second: Edge): Edge | undefined {
  if (first.type === EdgeType.Simple) {
    return second;
  } else if (second.type === EdgeType.Simple) {
    return first;
  }
  if (first.type === EdgeType.Expression && second.type === EdgeType.Expression) {
    const merged: PartialExpr | undefined = mergePartialExpressions(first.expression, second.expression);
    if (merged === undefined) {
      return undefined;
    }
    return {type: EdgeType.Expression, expression: merged};
  }
  return undefined;
}
