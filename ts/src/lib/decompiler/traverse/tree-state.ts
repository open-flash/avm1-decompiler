import { Node, RoNode } from "../../as2-types/node";

/**
 * Interface identifying the parent Node and its relationship to the current node.
 */
export interface NodeParent<N extends RoNode = Node> {
  /**
   * Parent node.
   */
  node: N;

  /**
   * Key in the parent node containing the child.
   *
   * If the key is a corresponds to a node, you get:
   * ```
   * const self: Node = ...;
   * const parent: NodeParent = getParent(self)!;
   * assert(self === parent.node[parent.key]);
   * ```
   *
   * If the key is a corresponds to a node list, you get:
   * ```
   * const self: Node = ...;
   * const parent: NodeParent = getParent(self)!;
   * assert(parent.node[parent.key].contains(self));
   * ```
   */
  key: string;

  /**
   * If `key` corresponds to a node list, index in the list so you get:
   * ```
   * const self: Node = ...;
   * const parent: NodeParent = getParent(self)!;
   * assert(self === parent.node[parent.key][parent.index]);
   * ```
   */
  index: number;
}
