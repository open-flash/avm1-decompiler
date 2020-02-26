import { RoStatement, Statement } from "./statement";

export interface Script<L = unknown> {
  type: "Script";
  loc: L;
  body: Statement<L>[];
}

export interface RoScript<L = unknown> {
  readonly type: "Script";
  readonly loc: L;
  readonly body: RoStatement<L>[];
}
