import { RoNode } from "../../as2-types/node";
import { RoOpPop } from "../../as2-types/op-expressions/op-pop";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { RoOpStackCall } from "../../as2-types/op-statements/op-stack-call";
import { FlowAnalyzer, InputOutput, InputOutputAnalyzer } from "./analyzer";
import { passThrough } from "./pass-through";

/**
 * The stack state is represented as a linked list of operations.
 */
export type StackState<L> = StackStateBottom<L> | StackStateStackCall<L> | StackStatePush<L> | StackStatePop<L>;

/**
 * Bottom of the stack, serves as the initial state.
 */
export interface StackStateBottom<L> {
  type: "bottom";
  /**
   * Start node.
   */
  node: RoNode<L>;

  old: undefined;
}

/**
 * Stack with a pushed value on top.
 */
export interface StackStatePush<L> {
  type: "push";
  node: RoOpPush<L>;
  old: StackState<L>;
}

/**
 * Stack with an unmatched popped value.
 */
export interface StackStatePop<L> {
  type: "pop";
  node: RoOpPop<L>;
  old: Exclude<StackState<L>, StackStatePush<L>>;
}

/**
 * Stack after a `@stackCall`: due to its dynamic nature, it leaves the stack
 * in an unknown state.
 */
export interface StackStateStackCall<L> {
  type: "stack-call";
  node: RoOpStackCall<L>;
  old: StackState<L>;
}

export function analyzeStackUsage<N extends RoNode = RoNode>(
  root: N,
): WeakMap<RoNode<N["loc"]>, InputOutput<StackState<N["loc"]>>> {
  const input: StackState<N["loc"]> = {type: "bottom", node: root, old: undefined} as StackState<N["loc"]>;
  return InputOutputAnalyzer.analyze(root, input, transferStackUsage);
}

function transferStackUsage<L>(
  analyzer: FlowAnalyzer<StackState<L>>,
  node: RoNode<L>,
  input: StackState<L>,
): StackState<L> {
  switch (node.type) {
    case "OpPush":
      return opPush(analyzer, node, input);
    case "OpPop":
      return opPop(analyzer, node, input);
    default:
      return passThrough(analyzer, node, input);
  }
}

function opPush<L>(
  analyzer: FlowAnalyzer<StackState<L>>,
  node: RoOpPush<L>,
  input: StackState<L>,
): StackState<L> {
  const old: StackState<L> = analyzer.transfer(node.value, input);
  return {type: "push", node, old};
}

function opPop<L>(
  _analyzer: FlowAnalyzer<StackState<L>>,
  node: RoOpPop<L>,
  input: StackState<L>,
): StackState<L> {
  if (input.type === "push") {
    return input.old;
  } else {
    return {type: "pop", node, old: input};
  }
}
