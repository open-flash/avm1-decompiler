import { Expression, RoExpression } from "../as2-types/expression";
import { Node, RoNode } from "../as2-types/node";
import { OpTemporary } from "../as2-types/op-expressions/op-temporary";
import { OpTemporaryPattern } from "../as2-types/op-patterns/op-temporary-pattern";
import { RoScript, Script } from "../as2-types/script";
import { RoStatement, Statement } from "../as2-types/statement";
import { ScopeContext } from "./action";
import { buildTreeState, TreeState } from "./traverse/build";
import { getFirstChild } from "./traverse/first-child";
import { getNextSibling } from "./traverse/next-sibling";
import { OpTemporaryPath, OpTemporaryPatternPath, Path, ScriptPath } from "./traverse/path";
import { replace } from "./traverse/replace";
import { Traversal } from "./traverse/traversal";
import { TraversalEvent } from "./traverse/traversal-event";
import { NodeParent } from "./traverse/tree-state";
import { ResolvedVisitor, resolveVisitor, Visitor, VisitorAction } from "./traverse/visitor";

/**
 * Represents a mutable AST with parent information.
 */
export class Tree<L = unknown> {
  readonly root: Script<L>;
  private readonly traversals: Traversal<L, unknown>[];
  private readonly parents: WeakMap<RoNode<L>, NodeParent<Node<L>>>;
  private readonly paths: WeakMap<RoNode<L>, Path<RoNode<L>>>;
  private readonly scopes: WeakMap<RoNode<L>, ScopeContext>;

  constructor(root: Script<L>) {
    const state: TreeState<L> = buildTreeState(this, root);
    this.root = state.root;
    this.traversals = [];
    this.parents = state.parents;
    this.paths = state.paths;
    this.scopes = new WeakMap();
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
      if (action === VisitorAction.Stop || (traversal.node === node && traversal.event === TraversalEvent.Exit)) {
        done = true;
      } else {
        done = this.advance(traversal, action === VisitorAction.Skip);
      }
    }
    this.traversals.pop();
    return traversal.state;
  }

  public replaceStatement(oldNode: RoStatement<L>, newNode: Statement<L>): void {
    if (this.traversals.length > 0) {
      throw new Error("Cannot replace statement while there are active traversals");
    }
    replace({tree: this, paths: this.paths, parents: this.parents, root: this.root}, oldNode, newNode);
  }

  public replaceExpression(oldNode: RoExpression<L>, newNode: Expression<L>): void {
    if (this.traversals.length > 0) {
      throw new Error("Cannot replace statement while there are active traversals");
    }
    replace({tree: this, paths: this.paths, parents: this.parents, root: this.root}, oldNode, newNode);
  }

  /**
   * Check if this tree contains the provided Node.
   */
  public contains(node: RoNode<L>): boolean {
    return this.paths.has(node);
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

  public scope(node: RoNode<L>): ScopeContext {
    if (!this.contains(node)) {
      throw new Error("AssertionError: input node is not in this tree");
    }
    while (true) {
      if (isScopeNode(node)) {
        break;
      }
      const parent: NodeParent<Node<L>> | null = this.parent(node);
      if (parent === null) {
        break;
      }
      node = parent.node;
    }
    return this.getScope(node);
  }

  /**
   * Retrieves scope information for the provided node.
   * `node` must be a scope node (script or function) or the tree root.
   */
  private getScope(node: RoNode<L>): ScopeContext {
    let scope: ScopeContext | undefined = this.scopes.get(node);
    if (scope === undefined) {
      interface State {
        maxTemp: number;
      }

      const state: State = this.traverseFrom(
        node,
        {
          opTemporary: {
            enter(path: OpTemporaryPath<OpTemporary<L>>, state: State): VisitorAction {
              state.maxTemp = Math.max(state.maxTemp, path.node().id);
              return VisitorAction.Advance;
            },
          },
          opTemporaryPattern: {
            enter(path: OpTemporaryPatternPath<OpTemporaryPattern<L>>, state: State): VisitorAction {
              state.maxTemp = Math.max(state.maxTemp, path.node().id);
              return VisitorAction.Advance;
            },
          },
          script: {
            enter(path: ScriptPath<RoScript<L>>): VisitorAction {
              return node === path.node() ? VisitorAction.Advance : VisitorAction.Skip;
            },
          },
        },
        {maxTemp: -Infinity},
      );

      scope = new ScopeContext(state.maxTemp >= 0 ? state.maxTemp + 1 : 0);
    }
    return scope;
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

function isScopeNode<L>(node: RoNode<L>): node is Script<L> {
  return node.type === "Script";
}
