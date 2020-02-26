import { Node, RoNode } from "../as2-types/node";
import { Script } from "../as2-types/script";
import { Statement } from "../as2-types/statement";
import { buildTreeState, TreeState } from "./traverse/build";
import { getFirstChild } from "./traverse/first-child";
import { getNextSibling } from "./traverse/next-sibling";
import { Traversal } from "./traverse/traversal";
import { TraversalEvent } from "./traverse/traversal-event";
import { NodeParent } from "./traverse/tree-state";

export enum VisitorAction {
  /**
   * Advance to the next node in the traversal.
   */
  Advance,

  /**
   * Skip all sub-trees of the current node.
   */
  Skip,

  /**
   * Stop the traversal.
   */
  Stop,
}

export interface Visitor<L, S> {
  node?: VisitorFn<RoNode<L>, S>;
  // expressionStatement?: VisitorFn<RoExpressionStatement<L>, S>;
  // opPush?: VisitorFn<RoOpPush<L>, S>;
  // statement?: VisitorFn<RoStatement<L>, S>;
}

export interface VisitorFn<N extends RoNode, S> {
  enter?(path: Path<N>, state: S): VisitorAction | undefined;

  exit?(path: Path<N>, state: S): VisitorAction | undefined;
}

export class Tree<L = unknown> {
  readonly root: Script<L>;
  private readonly traversals: Traversal<L, unknown>[];
  private readonly parents: WeakMap<RoNode<L>, NodeParent<Node<L>>>;

  constructor(root: Script<L>) {
    const state: TreeState<L> = buildTreeState(root);
    this.root = state.root;
    this.traversals = [];
    this.parents = state.parents;
  }

  traverse<S>(visitor: Visitor<L, S>, state: S): S {
    const traversal: Traversal<L, S> = {node: this.root, state, event: TraversalEvent.Enter};
    this.traversals.push(traversal);
    let done: boolean = false;
    while (!done) {
      let action: VisitorAction;
      if (traversal.event === TraversalEvent.Enter) {
        action = this.onEnter(visitor, traversal.node, traversal.state);
      } else {
        action = this.onExit(visitor, traversal.node, traversal.state);
      }
      done = this.advance(traversal, action === VisitorAction.Skip);
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

  private onEnter<S>(visitor: Visitor<L, S>, node: RoNode<L>, state: S): VisitorAction {
    let action: VisitorAction | undefined;
    if (visitor.node !== undefined && visitor.node.enter !== undefined) {
      const path: Path<RoNode<L>> = new Path(this, node);
      action = visitor.node.enter(path, state);
    }
    // if (visitor.statement !== undefined && visitor.statement.enter !== undefined && this.isStatement(node)) {
    //   const path: Path<RoStatement<L>> = new Path<RoStatement<L>>(this, node);
    //   action = visitor.statement.enter(path, state);
    // }
    return action ?? VisitorAction.Advance;
  }

  private onExit<S>(visitor: Visitor<L, S>, node: RoNode<L>, state: S): VisitorAction {
    let action: VisitorAction | undefined;
    if (visitor.node !== undefined && visitor.node.exit !== undefined) {
      const path: Path<RoNode<L>> = new Path(this, node);
      action = visitor.node.exit(path, state);
    }
    return action ?? VisitorAction.Advance;
  }

  // private isStatement<L>(node: RoNode<L>): node is RoStatement<L> {
  //   return node.type === "ExpressionStatement";
  // }
}

class Path<N extends RoNode> {
  private readonly _tree: Tree<N["loc"]>;
  private readonly _node: N;

  constructor(tree: Tree<N["loc"]>, node: N) {
    this._tree = tree;
    this._node = node;
  }

  node(): N {
    return this._node;
  }

  replaceWith(statement: Statement<N["loc"]>) {
    this._tree.replaceWith(this._node, statement);
  }
}
