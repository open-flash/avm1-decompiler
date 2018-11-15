import { Cfg } from "./cfg/cfg";
import { Edge, EdgeType } from "./cfg/edge";
import { NodeType, SimpleNode } from "./cfg/node";
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
  let curChain: SimpleNode[] = [];
  for (const node of cfg.iterNodes()) {
    let pushed: boolean = false;
    if (node.type === NodeType.Simple) {
      if (curChain.length === 0) {
        curChain.push(node);
        pushed = true;
      } else if (node === curChain[curChain.length - 1].out.to && cfg.getInDegree(node) === 1) {
        // We're using the fact that the traversal is a DFS
        curChain.push(node);
        pushed = true;
      }
    }
    if (!pushed && curChain.length > 0) {
      yield curChain;
      curChain = [];
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
