import { AssignmentOperator } from "../../as2-types/assignment-operator";
import { Expression } from "../../as2-types/expression";
import { RoNode } from "../../as2-types/node";
import { RoOpPop } from "../../as2-types/op-expressions/op-pop";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { ScopeContext } from "../action";
import { InputOutput } from "../analysis/analyzer";
import { analyzeStackUsage, StackState } from "../analysis/stack-usage";
import { Tree } from "../traverse";
import { OpPopPath, Path } from "../traverse/path";
import { VisitorAction } from "../traverse/visitor";

export function eliminatePushPop(tree: Tree<null>) {
  const root: RoNode<null> = tree.root;
  const rootPath: Path<RoNode<null>> = tree.path(root);
  const stackUsage: WeakMap<RoNode<null>, InputOutput<StackState<null>>> = analyzeStackUsage(root);
  const unmatchedPushes: Set<RoNode<null>> = getPushes(getStackUsage(root).output);
  const pushPops: Map<RoOpPush<null>, Set<RoOpPop<null>>> = findPushPops(rootPath, stackUsage, unmatchedPushes);

  for (const [push, pops] of pushPops) {
    const scope: ScopeContext = tree.scope(push);
    const tempId: number = scope.allocTemporary();
    tree.replaceStatement(
      push,
      {
        type: "ExpressionStatement",
        loc: null,
        expression: {
          type: "AssignmentExpression",
          loc: null,
          operator: AssignmentOperator.Simple,
          target: {
            type: "OpTemporaryPattern",
            loc: null,
            id: tempId,
          },
          value: push.value as Expression<null>,
        },
      },
    );
    for (const pop of pops) {
      tree.replaceExpression(
        pop,
        {
          type: "OpTemporary",
          loc: null,
          id: tempId,
        },
      );
    }
  }

  function getStackUsage(node: RoNode<null>): InputOutput<StackState<null>> {
    const usage: InputOutput<StackState<null>> | undefined = stackUsage.get(node);
    if (usage === undefined) {
      throw new Error("AssertionError: Non-analyzed node");
    }
    return usage;
  }
}

function findPushPops(
  path: Path<RoNode<null>>,
  stackUsage: WeakMap<RoNode<null>, InputOutput<StackState<null>>>,
  unmatchedPushes: Set<RoNode<null>>,
): Map<RoOpPush<null>, Set<RoOpPop<null>>> {
  return path.traverse(
    {
      opPop: {
        enter(path: OpPopPath<RoOpPop<null>>, state: Map<RoOpPush<null>, Set<RoOpPop<null>>>): VisitorAction {
          const usage: InputOutput<StackState<null>> | undefined = stackUsage.get(path.node());
          if (usage === undefined) {
            throw new Error("AssertionError: Non-analyzed node");
          }
          if (usage.input.type === "push") {
            const pushNode: RoOpPush<null> = usage.input.node;
            if (!unmatchedPushes.has(pushNode)) {
              // We found a pop action using a fully-matched `@push`.
              let pops: Set<RoOpPop<null>> | undefined = state.get(pushNode);
              if (pops === undefined) {
                pops = new Set();
                state.set(pushNode, pops);
              }
              pops.add(path.node());
            }
          }
          return VisitorAction.Advance;
        },
      },
    },
    new Map(),
  );
}

function getPushes<L>(stackState: StackState<L>): Set<RoNode<L>> {
  const pushes: Set<RoNode<L>> = new Set();
  let cur: StackState<L> | undefined = stackState;
  while (cur !== undefined) {
    if (cur.type === "push") {
      pushes.add(cur.node);
    }
    cur = cur.old;
  }
  return pushes;
}
