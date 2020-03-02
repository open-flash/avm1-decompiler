import { Node, RoNode } from "../../as2-types/node";
import { node as buildNode, TreeState } from "./build";
import { Path } from "./path";
import { NodeParent } from "./tree-state";
import { VisitorAction } from "./visitor";

export function replace<L = unknown>(tree: TreeState<L>, oldNode: RoNode<L>, newNode: Node<L>) {
  const parent: NodeParent<Node<L>> | undefined = tree.parents.get(oldNode);
  if (parent === undefined) {
    throw new Error("Old node is not a child node (it's the root or not in the tree)");
  }

  const oldSubTree: Set<RoNode<L>> = tree.tree.traverseFrom(
    oldNode,
    {
      node: {
        enter: (path: Path<RoNode<L>>, state: Set<RoNode<L>>): VisitorAction => {
          state.add(path.node());
          return VisitorAction.Advance;
        },
      },
    },
    new Set(),
  );

  console.log(oldSubTree.size);

  for (const oldSubTreeNode of oldSubTree) {
    tree.parents.delete(oldSubTreeNode);
    tree.paths.delete(oldSubTreeNode);
  }

  const keyValue: Node<L>[] | Node<L> = Reflect.get(parent.node, parent.key);
  if (Array.isArray(keyValue)) {
    keyValue[parent.index] = newNode;
  } else {
    Reflect.set(parent.node, parent.key, newNode);
  }
  tree.parents.set(newNode, parent);
  buildNode(tree, newNode);
}
