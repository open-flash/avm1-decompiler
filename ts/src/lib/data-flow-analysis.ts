import { Cfg, Edge, Node } from "./cfg";

export interface DataFlowAnalyzer<T> {
  initialize(node: Node, cfg: Cfg): T;

  transfer(edge: Edge, input: T): T;

  join(states: ReadonlyArray<T>): T;

  equals(left: T, right: T): boolean;
}

export function analyze<T>(cfg: Cfg, analyzer: DataFlowAnalyzer<T>): Map<Node, T> {
  const result: Map<Node, T> = new Map();
  for (const node of cfg.iterNodes()) {
    result.set(node, analyzer.initialize(node, cfg));
  }
  let changed: boolean = true;
  while (changed) {
    changed = false;
    for (const node of cfg.iterNodes()) {
      const oldState: T = result.get(node)!;
      const states: T[] = [];
      for (const {from, edge} of cfg.getInEdges(node)) {
        const input: T = result.get(from)!;
        const output: T = analyzer.transfer(edge, input);
        states.push(output);
      }
      const joined: T = analyzer.join(states);
      if (!analyzer.equals(joined, oldState)) {
        result.set(node, joined);
        changed = true;
      }
    }
  }
  return result;
}
