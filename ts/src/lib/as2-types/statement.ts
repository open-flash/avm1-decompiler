import { OpCallFunction, RoOpCallFunction } from "./op-statements/op-call-function";
import { OpConstantPool, RoOpConstantPool } from "./op-statements/op-constant-pool";
import { OpDeclareVariable, RoOpDeclareVariable } from "./op-statements/op-declare-variable";
import { OpEnumerate, RoOpEnumerate } from "./op-statements/op-enumerate";
import { OpInitArray, RoOpInitArray } from "./op-statements/op-init-array";
import { OpInitObject, RoOpInitObject } from "./op-statements/op-init-object";
import { OpPush, RoOpPush } from "./op-statements/op-push";
import { OpTrace, RoOpTrace } from "./op-statements/op-trace";
import { BlockStatement, RoBlockStatement } from "./statements/block-statement";
import { EmptyStatement, RoEmptyStatement } from "./statements/empty-statement";
import { ExpressionStatement, RoExpressionStatement } from "./statements/expression-statement";
import {
  IfFrameLoadedStatement,
  RoIfFrameLoadedStatement,
} from "./statements/if-frame-loaded-statement";
import { IfStatement, RoIfStatement } from "./statements/if-statement";
import { ReturnStatement, RoReturnStatement } from "./statements/return-statement";
import { RoSetVariable, SetVariable } from "./statements/set-variable";
import { RoThrowStatement, ThrowStatement } from "./statements/throw-statement";

export type Statement<L = unknown> =
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

export type RoStatement<L = unknown> =
  RoBlockStatement<L>
  | RoEmptyStatement<L>
  | RoExpressionStatement<L>
  | RoIfFrameLoadedStatement<L>
  | RoIfStatement<L>
  | RoOpCallFunction<L>
  | RoOpConstantPool<L>
  | RoOpDeclareVariable<L>
  | RoOpEnumerate<L>
  | RoOpInitArray<L>
  | RoOpInitObject<L>
  | RoOpPush<L>
  | RoOpTrace<L>
  | RoReturnStatement<L>
  | RoSetVariable<L>
  | RoThrowStatement<L>;
