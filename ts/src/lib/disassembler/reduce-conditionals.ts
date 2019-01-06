import { buildLinear } from "../cfg/builder";
import { Cfg } from "../cfg/cfg";
import { ConditionalEdge, Edge, EdgeType } from "../cfg/edge";
import { IfNode, Node, NodeType, SimpleNode } from "../cfg/node";

export function reduceConditionals(cfg: Cfg): boolean {
  const conditionals: ReadonlyArray<Conditional> = [...findConditionals(cfg)];
  if (conditionals.length === 0) {
    return false;
  }
  for (const conditional of conditionals) {
    cfg.replaceInterval(conditional.src, conditional.dest, [conditional.edge]);
  }
  return true;
}

interface Conditional {
  src: SimpleNode;
  dest: Node;
  edge: ConditionalEdge;
}

function findConditionals(cfg: Cfg): Iterable<Conditional> {
  const result: Conditional[] = [];
  const nodes: ReadonlyArray<Node> = [...cfg.iterNodes()];
  let i: number = 0;
  while (i < nodes.length) {
    const next: Conditional | number | undefined = checkConditional(cfg, nodes, i);
    if (next === undefined) {
      i++;
    } else if (typeof next === "number") {
      i = next;
    } else {
      result.push(next);
      i = nodes.indexOf(next.dest);
    }
  }
  return result;
}

function checkConditional(cfg: Cfg, nodes: ReadonlyArray<Node>, startIndex: number): Conditional | number | undefined {
  const uncheckedStartNode: Node = nodes[startIndex];
  if (uncheckedStartNode.type !== NodeType.Simple || uncheckedStartNode.out.edge.type !== EdgeType.IfTest) {
    return undefined;
  }
  const startNode: SimpleNode = uncheckedStartNode;

  const uncheckedIfNode: Node = startNode.out.to;
  if (uncheckedIfNode.type !== NodeType.If) {
    throw new Error("AssertionError: IfTest edge not followed by If node");
  } else if (cfg.getInDegree(uncheckedIfNode) !== 1) {
    throw new Error("AssertionError: If node has `inDegree !== 1`");
  }
  const ifNode: IfNode = uncheckedIfNode;
  if (startIndex + 1 >= nodes.length || nodes[startIndex + 1] !== ifNode) {
    return startIndex + 1;
  }

  const ifFalseChain: Edge[] = [];
  const ifTrueChain: Edge[] = [];

  let falseHead: Node = ifNode;
  let trueHead: Node = ifNode;

  for (let i: number = startIndex + 2; i < nodes.length; i++) {
    const node: Node = nodes[i];
    for (const {from, edge, to} of cfg.getInEdges(node)) {
      let chain: true | false | undefined = undefined;
      if (from.type === NodeType.Simple) {
        if (from === falseHead) {
          chain = false;
        } else if (from === trueHead) {
          chain = true;
        }
      } else if (from === ifNode) {
        if (edge === ifNode.outFalse.edge) {
          chain = false;
        } else if (edge === ifNode.outTrue.edge) {
          chain = true;
        }
      }

      if (chain === false) {
        if (cfg.getInDegree(falseHead) !== 1) {
          return i;
        }
        ifFalseChain.push(edge);
        falseHead = to;
      } else if (chain === true) {
        if (cfg.getInDegree(trueHead) !== 1) {
          return i;
        }
        ifTrueChain.push(edge);
        trueHead = to;
      } else {
        return i;
      }

      if (falseHead === trueHead) {
        return {
          src: startNode,
          dest: falseHead,
          edge: toConditionalEdge(ifFalseChain, ifTrueChain),
        };
      }
    }
  }
  return nodes.length;
}

function toConditionalEdge(ifFalseChain: ReadonlyArray<Edge>, ifTrueChain: ReadonlyArray<Edge>): ConditionalEdge {
  const ifFalse: Cfg = buildLinear(ifFalseChain);
  const ifTrue: Cfg = buildLinear(ifTrueChain);
  return {
    type: EdgeType.Conditional,
    ifFalse,
    ifTrue,
  };
}
