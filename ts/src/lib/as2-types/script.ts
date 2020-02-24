import { Statement } from "./statement";

export interface Script<L = null> {
  type: "Script";
  loc: L;
  body: Statement<L>;
}
