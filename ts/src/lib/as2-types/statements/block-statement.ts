import { RoStatement, Statement } from "../statement";

export interface BlockStatement<L = unknown> {
  type: "BlockStatement";
  loc: L;
  body: Statement<L>[];
}

export interface RoBlockStatement<L = unknown> {
  readonly type: "BlockStatement";
  readonly loc: L;
  readonly body: readonly RoStatement<L>[];
}
