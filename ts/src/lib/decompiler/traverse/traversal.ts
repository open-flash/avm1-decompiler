import { RoNode } from "../../as2-types/node";
import { TraversalEvent } from "./traversal-event";

export interface Traversal<L, S> {
  node: RoNode<L>;

  readonly state: S;

  event: TraversalEvent;
}
