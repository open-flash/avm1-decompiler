import { OpConstantPool } from "./op-statements/op-constant-pool";
import { OpDeclareVariable } from "./op-statements/op-declare-variable";
import { OpPush } from "./op-statements/op-push";
import { OpTrace } from "./op-statements/op-trace";
import { BlockStatement } from "./statements/block-statement";
import { EmptyStatement } from "./statements/empty-statement";
import { ExpressionStatement } from "./statements/expression-statement";
import { IfFrameLoadedStatement } from "./statements/if-frame-loaded-statement";
import { IfStatement } from "./statements/if-statement";
import { ReturnStatement } from "./statements/return-statement";
import { SetVariable } from "./statements/set-variable";
import { ThrowStatement } from "./statements/throw-statement";

export type Statement<L = null> =
  BlockStatement<L>
  | EmptyStatement<L>
  | ExpressionStatement<L>
  | IfFrameLoadedStatement<L>
  | IfStatement<L>
  | OpConstantPool<L>
  | OpDeclareVariable<L>
  | OpPush<L>
  | OpTrace<L>
  | ReturnStatement<L>
  | SetVariable<L>
  | ThrowStatement<L>;
