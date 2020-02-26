import { Node, RoNode } from "../as2-types/node";
import { Script } from "../as2-types/script";
import { buildTreeState, TreeState } from "./traverse/build";
import { getFirstChild } from "./traverse/first-child";
import { getNextSibling } from "./traverse/next-sibling";
import { Path } from "./traverse/path";
import { Traversal } from "./traverse/traversal";
import { TraversalEvent } from "./traverse/traversal-event";
import { NodeParent } from "./traverse/tree-state";
import { ResolvedVisitor, resolveVisitor, Visitor, VisitorAction } from "./traverse/visitor";

export class Tree<L = unknown> {
  readonly root: Script<L>;
  private readonly traversals: Traversal<L, unknown>[];
  private readonly parents: WeakMap<RoNode<L>, NodeParent<Node<L>>>;
  private readonly paths: WeakMap<RoNode<L>, Path<RoNode<L>>>;

  constructor(root: Script<L>) {
    const state: TreeState<L> = buildTreeState(this, root);
    this.root = state.root;
    this.traversals = [];
    this.parents = state.parents;
    this.paths = state.paths;
  }

  public traverse<S>(visitor: Visitor<L, S>, state: S): S {
    return this.traverseFrom(this.root, visitor, state);
  }

  public traverseFrom<S>(node: RoNode<L>, visitor: Visitor<L, S>, state: S): S {
    const resolvedVisitor: ResolvedVisitor<L, S> = resolveVisitor(visitor);
    const traversal: Traversal<L, S> = {node, state, event: TraversalEvent.Enter};
    this.traversals.push(traversal);
    let done: boolean = false;
    while (!done) {
      const path: Path<RoNode<L>> = this.path(traversal.node);
      const action: VisitorAction | undefined = path.visit(
        traversal.event === TraversalEvent.Enter ? resolvedVisitor.enter : resolvedVisitor.exit,
        traversal.state,
      );
      if (action === VisitorAction.Stop) {
        done = true;
      } else {
        done = this.advance(traversal, action === VisitorAction.Skip);
      }
    }
    this.traversals.pop();
    return traversal.state;
  }

  public replaceWith(oldNode: RoNode<L>, newNode: Node<L>) {
    console.log(oldNode);
    console.log(newNode);
    throw new Error("NotImplemented: Tree#replaceWith");
  }

  /**
   * Check if this tree contains the provided Node.
   */
  public contains(node: RoNode<L>): boolean {
    return node === this.root || this.parents.has(node);
  }

  // public path<N extends RoNode<L>>(node: N): Path<N>;
  public path(node: RoNode<L>): Path<RoNode<L>> {
    const path: Path<RoNode<L>> | undefined = this.paths.get(node);
    if (path === undefined) {
      throw new Error("AssertionError: input node is not in this tree");
    }
    return path;
  }

  public parent(node: RoNode<L>): NodeParent<Node<L>> | null {
    if (node === this.root) {
      return null;
    }
    const parent: NodeParent<Node<L>> | undefined = this.parents.get(node);
    if (parent === undefined) {
      throw new Error("AssertionError: input node is not in this tree");
    }
    return parent;
  }

  private advance<S>(traversal: Traversal<L, S>, skipChildren: boolean): boolean {
    if (traversal.event === TraversalEvent.Enter) {
      // We just entered a new node: the next node will be our first child
      // if we have one and are allowed to traverse children
      if (!skipChildren) {
        // We are allowed to look for children: retrieve the first child
        const firstChild: RoNode<L> | undefined = getFirstChild(traversal.node);
        if (firstChild !== undefined) {
          traversal.node = firstChild;
          traversal.event = TraversalEvent.Enter;
          return false;
        }
      }
      // No child found: simply exit the current node
      traversal.event = TraversalEvent.Exit;
      return false;
    }
    // We are exiting the current node: go to next sibling, or parent
    // assert(traversal.event === TraversalEvent.Exit);
    const parent: NodeParent<Node<L>> | null = this.parent(traversal.node);
    if (parent === null) {
      return true;
    }
    const nextSibling: RoNode<L> | undefined = getNextSibling(parent);
    if (nextSibling !== undefined) {
      traversal.node = nextSibling;
      traversal.event = TraversalEvent.Enter;
    } else {
      traversal.node = parent.node;
      traversal.event = TraversalEvent.Exit;
    }
    return false;
  }
}
