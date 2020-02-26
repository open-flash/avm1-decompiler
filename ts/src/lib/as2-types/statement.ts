import { OpCallFunction } from "./op-statements/op-call-function";
import { OpConstantPool } from "./op-statements/op-constant-pool";
import { OpDeclareVariable } from "./op-statements/op-declare-variable";
import { OpEnumerate } from "./op-statements/op-enumerate";
import { OpInitArray } from "./op-statements/op-init-array";
import { OpInitObject } from "./op-statements/op-init-object";
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
  | OpCallFunction<L>
  | OpConstantPool<L>
  | OpDeclareVariable<L>
  | OpEnumerate<L>
  | OpInitArray<L>
  | OpInitObject<L>
  | OpPush<L>
  | OpTrace<L>
  | ReturnStatement<L>
  | SetVariable<L>
  | ThrowStatement<L>;
