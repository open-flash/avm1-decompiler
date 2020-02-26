import { ActionType } from "avm1-types/action-type";
import { Action } from "avm1-types/cfg/action";
import * as actions from "avm1-types/cfg/actions/index";
import { PushValue } from "avm1-types/push-value";
import { PushValueType } from "avm1-types/push-value-type";
import { AssignmentOperator } from "../as2-types/assignment-operator";
import { BinaryOperator } from "../as2-types/binary-operator";
import { Expression } from "../as2-types/expression";
import { AssignmentExpression } from "../as2-types/expressions/assignment-expression";
import { BinaryExpression } from "../as2-types/expressions/binary-expression";
import { BooleanLiteral } from "../as2-types/expressions/boolean-literal";
import { MemberExpression } from "../as2-types/expressions/member-expression";
import { NullLiteral } from "../as2-types/expressions/null-literal";
import { NumberLiteral } from "../as2-types/expressions/number-literal";
import { StringLiteral } from "../as2-types/expressions/string-literal";
import { UnaryExpression } from "../as2-types/expressions/unary-expression";
import { OpConstant } from "../as2-types/op-expressions/op-constant";
import { OpInitArray } from "../as2-types/op-expressions/op-init-array";
import { OpInitObject } from "../as2-types/op-expressions/op-init-object";
import { OpPop } from "../as2-types/op-expressions/op-pop";
import { OpPropertyName } from "../as2-types/op-expressions/op-property-name";
import { OpRegister } from "../as2-types/op-expressions/op-register";
import { OpTemporary } from "../as2-types/op-expressions/op-temporary";
import { OpUndefined } from "../as2-types/op-expressions/op-undefined";
import { OpVariable } from "../as2-types/op-expressions/op-variable";
import { OpRegisterPattern } from "../as2-types/op-patterns/op-register-pattern";
import { OpConstantPool } from "../as2-types/op-statements/op-constant-pool";
import { OpDeclareVariable } from "../as2-types/op-statements/op-declare-variable";
import { OpPush } from "../as2-types/op-statements/op-push";
import { OpTrace } from "../as2-types/op-statements/op-trace";
import { Pattern } from "../as2-types/pattern";
import { MemberPattern } from "../as2-types/patterns/member-pattern";
import { Statement } from "../as2-types/statement";
import { SetVariable } from "../as2-types/statements/set-variable";
import { UnaryOperator } from "../as2-types/unary-operator";

export class ScopeContext {
  private nextTemporaryId: number;

  public constructor() {
    this.nextTemporaryId = 0;
  }

  /**
   * Create a new temporary variable.
   */
  public createTemporary(): number {
    return this.nextTemporaryId++;
  }
}

export class OpAs2Emitter<L = null> {
  private readonly region: ScopeContext;
  private readonly loc: L;
  private readonly stream: Statement<L>[];

  constructor(region: ScopeContext, loc: L, stream: Statement<L>[]) {
    this.region = region;
    this.loc = loc;
    this.stream = stream;
  }

  public allocTemp(): number {
    return this.region.createTemporary();
  }

  public write(statement: Statement<L>): void {
    this.stream.push(statement);
  }

  public writeExpr(expression: Expression<L>): void {
    this.write({type: "ExpressionStatement", loc: this.loc, expression});
  }

  public writePush(value: Expression<L>): void {
    this.write(this.opPush(value));
  }

  public writePopTemp(): number {
    const id: number = this.allocTemp();
    this.writeExpr(this.popTemp(id));
    return id;
  }

  public popTemp(id: number): AssignmentExpression<L> {
    return this.simpleAssignment({type: "OpTemporaryPattern", loc: this.loc, id}, this.opPop());
  }

  public opConstantPool(pool: StringLiteral<L>[]): OpConstantPool<L> {
    return {type: "OpConstantPool", loc: this.loc, pool};
  }

  public opDeclareVar(name: Expression<L>, value: Expression<L> | null): OpDeclareVariable<L> {
    return {type: "OpDeclareVariable", loc: this.loc, name, value};
  }

  public opPush(value: Expression<L>): OpPush<L> {
    return {type: "OpPush", loc: this.loc, value};
  }

  public opTrace(value: Expression<L>): OpTrace<L> {
    return {type: "OpTrace", loc: this.loc, value};
  }

  public setVar(name: Expression<L>, value: Expression<L>): SetVariable<L> {
    return {type: "SetVariable", loc: this.loc, name, value};
  }

  public memberPattern(base: Expression<L>, key: Expression<L>): MemberPattern<L> {
    return {type: "MemberPattern", loc: this.loc, base, key};
  }

  public opRegPattern(id: number): OpRegisterPattern<L> {
    return {type: "OpRegisterPattern", loc: this.loc, id};
  }

  public simpleAssignment(target: Pattern<L>, value: Expression<L>): AssignmentExpression<L> {
    return this.assignment(AssignmentOperator.Simple, target, value);
  }

  public assignment(operator: AssignmentOperator, target: Pattern<L>, value: Expression<L>): AssignmentExpression<L> {
    return {type: "AssignmentExpression", loc: this.loc, operator, target, value};
  }

  public binExpr(operator: BinaryOperator, left: Expression<L>, right: Expression<L>): BinaryExpression<L> {
    return {type: "BinaryExpression", loc: this.loc, operator, left, right};
  }

  public boolLit(value: boolean): BooleanLiteral<L> {
    return {type: "BooleanLiteral", loc: this.loc, value};
  }

  public memberExpr(base: Expression<L>, key: Expression<L>): MemberExpression<L> {
    return {type: "MemberExpression", loc: this.loc, base, key};
  }

  public nullLit(): NullLiteral<L> {
    return {type: "NullLiteral", loc: this.loc};
  }

  public numLit(value: number): NumberLiteral<L> {
    return {type: "NumberLiteral", loc: this.loc, value};
  }

  public opConst(id: number): OpConstant<L> {
    return {type: "OpConstant", loc: this.loc, id};
  }

  public opInitArray(itemCount: Expression<L>): OpInitArray<L> {
    return {type: "OpInitArray", loc: this.loc, itemCount};
  }

  public opInitObject(itemCount: Expression<L>): OpInitObject<L> {
    return {type: "OpInitObject", loc: this.loc, itemCount};
  }

  public opPop(): OpPop<L> {
    return {type: "OpPop", loc: this.loc};
  }

  public opPropertyName(index: Expression<L>): OpPropertyName<L> {
    return {type: "OpPropertyName", loc: this.loc, index};
  }

  public opReg(id: number): OpRegister<L> {
    return {type: "OpRegister", loc: this.loc, id};
  }

  public opTemp(id: number): OpTemporary<L> {
    return {type: "OpTemporary", loc: this.loc, id};
  }

  public opUndef(): OpUndefined<L> {
    return {type: "OpUndefined", loc: this.loc};
  }

  public opVar(name: Expression<L>): OpVariable<L> {
    return {type: "OpVariable", loc: this.loc, name};
  }

  public strLit(value: string): StringLiteral<L> {
    return {type: "StringLiteral", loc: this.loc, value};
  }

  public unaryExpr(operator: UnaryOperator, argument: Expression<L>): UnaryExpression<L> {
    return {type: "UnaryExpression", loc: this.loc, operator, argument};
  }
}

// tslint:disable-next-line:cyclomatic-complexity
export function decompileAction(cx: OpAs2Emitter, action: Action): void {
  switch (action.action) {
    case ActionType.Raw:
      throw new Error("NotImplemented");
    case ActionType.Add:
      return decompileBinaryOperation(cx, BinaryOperator.LegacyAdd);
    case ActionType.Add2:
      return decompileBinaryOperation(cx, BinaryOperator.Add);
    case ActionType.And:
      throw new Error("NotImplemented");
    case ActionType.AsciiToChar:
      throw new Error("NotImplemented");
    case ActionType.BitAnd:
      return decompileBinaryOperation(cx, BinaryOperator.BitAnd);
    case ActionType.BitLShift:
      return decompileBinaryOperation(cx, BinaryOperator.LeftShift);
    case ActionType.BitOr:
      return decompileBinaryOperation(cx, BinaryOperator.BitOr);
    case ActionType.BitRShift:
      return decompileBinaryOperation(cx, BinaryOperator.SignedRightShift);
    case ActionType.BitURShift:
      return decompileBinaryOperation(cx, BinaryOperator.UnsignedRightShift);
    case ActionType.BitXor:
      return decompileBinaryOperation(cx, BinaryOperator.BitXor);
    case ActionType.Call:
      throw new Error("NotImplemented");
    case ActionType.CallFunction:
      throw new Error("NotImplemented");
    case ActionType.CallMethod:
      throw new Error("NotImplemented");
    case ActionType.CastOp:
      throw new Error("NotImplemented");
    case ActionType.ConstantPool:
      return decompileConstantPool(cx, action);
    case ActionType.CharToAscii:
      throw new Error("NotImplemented");
    case ActionType.CloneSprite:
      throw new Error("NotImplemented");
    case ActionType.Decrement:
      return decompileDecrement(cx);
    case ActionType.DefineFunction:
      throw new Error("NotImplemented: DefineFunction");
    case ActionType.DefineFunction2:
      throw new Error("NotImplemented: DefineFunction2");
    case ActionType.DefineLocal:
      return decompileDefineLocal(cx);
    case ActionType.DefineLocal2:
      return decompileDefineLocal2(cx);
    case ActionType.Delete:
      throw new Error("NotImplemented");
    case ActionType.Delete2:
      throw new Error("NotImplemented");
    case ActionType.Divide:
      return decompileBinaryOperation(cx, BinaryOperator.Divide);
    case ActionType.EndDrag:
      throw new Error("NotImplemented");
    case ActionType.Enumerate:
      throw new Error("NotImplemented");
    case ActionType.Enumerate2:
      throw new Error("NotImplemented");
    case ActionType.Equals:
      throw new Error("NotImplemented");
    case ActionType.Equals2:
      return decompileBinaryOperation(cx, BinaryOperator.Equals);
    case ActionType.Extends:
      throw new Error("NotImplemented");
    case ActionType.FsCommand2:
      throw new Error("NotImplemented");
    case ActionType.GetMember:
      return decompileGetMember(cx);
    case ActionType.GetProperty:
      return decompileGetProperty(cx);
    case ActionType.GetTime:
      throw new Error("NotImplemented");
    case ActionType.GetUrl:
      throw new Error("NotImplemented");
    case ActionType.GetUrl2:
      throw new Error("NotImplemented");
    case ActionType.GetVariable:
      return decompileGetVariable(cx);
    case ActionType.GotoFrame:
      throw new Error("NotImplemented");
    case ActionType.GotoFrame2:
      throw new Error("NotImplemented");
    case ActionType.GotoLabel:
      throw new Error("NotImplemented");
    case ActionType.Greater:
      return decompileBinaryOperation(cx, BinaryOperator.Greater);
    case ActionType.ImplementsOp:
      throw new Error("NotImplemented");
    case ActionType.Increment:
      return decompileIncrement(cx);
    case ActionType.InitArray:
      return decompileInitArray(cx);
    case ActionType.InitObject:
      return decompileInitObject(cx);
    case ActionType.InstanceOf:
      return decompileBinaryOperation(cx, BinaryOperator.InstanceOf);
    case ActionType.Less:
      throw new Error("NotImplemented");
    case ActionType.Less2:
      return decompileBinaryOperation(cx, BinaryOperator.Less);
    case ActionType.MbAsciiToChar:
      throw new Error("NotImplemented");
    case ActionType.MbCharToAscii:
      throw new Error("NotImplemented");
    case ActionType.MbStringExtract:
      throw new Error("NotImplemented");
    case ActionType.MbStringLength:
      throw new Error("NotImplemented");
    case ActionType.Modulo:
      return decompileBinaryOperation(cx, BinaryOperator.Remainder);
    case ActionType.Multiply:
      return decompileBinaryOperation(cx, BinaryOperator.Multiply);
    case ActionType.NewMethod:
      throw new Error("NotImplemented");
    case ActionType.NewObject:
      throw new Error("NotImplemented");
    case ActionType.NextFrame:
      throw new Error("NotImplemented");
    case ActionType.Not:
      return decompileUnaryOperation(cx, UnaryOperator.LogicalNot);
    case ActionType.Or:
      throw new Error("NotImplemented");
    case ActionType.Play:
      throw new Error("NotImplemented");
    case ActionType.Pop:
      return decompilePop(cx);
    case ActionType.Push:
      return decompilePush(cx, action);
    case ActionType.PreviousFrame:
      throw new Error("NotImplemented");
    case ActionType.PushDuplicate:
      throw new Error("NotImplemented");
    case ActionType.RandomNumber:
      throw new Error("NotImplemented");
    case ActionType.RemoveSprite:
      throw new Error("NotImplemented");
    case ActionType.Return:
      throw new Error("NotImplemented");
    case ActionType.SetMember:
      return decompileSetMember(cx);
    case ActionType.SetProperty:
      return decompileSetProperty(cx);
    case ActionType.SetTarget:
      throw new Error("NotImplemented");
    case ActionType.SetTarget2:
      throw new Error("NotImplemented");
    case ActionType.SetVariable:
      return decompileSetVariable(cx);
    case ActionType.StackSwap:
      return decompileStackSwap(cx);
    case ActionType.StartDrag:
      throw new Error("NotImplemented");
    case ActionType.Stop:
      throw new Error("NotImplemented");
    case ActionType.StopSounds:
      throw new Error("NotImplemented");
    case ActionType.StoreRegister:
      return decompileStoreRegister(cx, action);
    case ActionType.StrictEquals:
      return decompileBinaryOperation(cx, BinaryOperator.StrictEquals);
    case ActionType.StrictMode:
      throw new Error("NotImplemented");
    case ActionType.StringAdd:
      throw new Error("NotImplemented");
    case ActionType.StringEquals:
      throw new Error("NotImplemented");
    case ActionType.StringExtract:
      throw new Error("NotImplemented");
    case ActionType.StringGreater:
      throw new Error("NotImplemented");
    case ActionType.StringLength:
      throw new Error("NotImplemented");
    case ActionType.StringLess:
      throw new Error("NotImplemented");
    case ActionType.Subtract:
      return decompileBinaryOperation(cx, BinaryOperator.Subtract);
    case ActionType.TargetPath:
      throw new Error("NotImplemented");
    case ActionType.Throw:
      throw new Error("NotImplemented");
    case ActionType.ToggleQuality:
      throw new Error("NotImplemented");
    case ActionType.ToInteger:
      throw new Error("NotImplemented");
    case ActionType.ToNumber:
      throw new Error("NotImplemented");
    case ActionType.ToString:
      throw new Error("NotImplemented");
    case ActionType.TypeOf:
      return decompileUnaryOperation(cx, UnaryOperator.TypeOf);
    case ActionType.Trace:
      return decompileTrace(cx);
    default:
      throw new Error("AssertionError: Unexpected Action type");
  }
}

function decompileBinaryOperation(cx: OpAs2Emitter, operator: BinaryOperator): void {
  const right: number = cx.writePopTemp();
  const left: number = cx.writePopTemp();
  cx.writePush(cx.binExpr(operator, cx.opTemp(left), cx.opTemp(right)));
}

function decompileConstantPool<L>(cx: OpAs2Emitter<L>, action: actions.ConstantPool): void {
  const pool: StringLiteral<L>[] = [];
  for (const constant of action.pool) {
    pool.push(cx.strLit(constant));
  }
  cx.write(cx.opConstantPool(pool));
}

function decompileDecrement<L>(cx: OpAs2Emitter<L>): void {
  const arg: number = cx.writePopTemp();
  cx.writePush(cx.binExpr(BinaryOperator.Subtract, cx.opTemp(arg), cx.numLit(1)));
}

function decompileDefineLocal(cx: OpAs2Emitter): void {
  const name: number = cx.writePopTemp();
  cx.write(cx.opDeclareVar(cx.opTemp(name), null));
}

function decompileDefineLocal2(cx: OpAs2Emitter): void {
  const value: number = cx.writePopTemp();
  const name: number = cx.writePopTemp();
  cx.write(cx.opDeclareVar(cx.opTemp(name), cx.opTemp(value)));
}

function decompileGetMember<L>(cx: OpAs2Emitter<L>): void {
  const key: number = cx.writePopTemp();
  const base: number = cx.writePopTemp();
  cx.writePush(cx.memberExpr(cx.opTemp(base), cx.opTemp(key)));
}

function decompileGetProperty<L>(cx: OpAs2Emitter<L>): void {
  const index: number = cx.writePopTemp();
  const base: number = cx.writePopTemp();
  cx.writePush(cx.memberExpr(cx.opTemp(base), cx.opPropertyName(cx.opTemp(index))));
}

function decompileGetVariable<L>(cx: OpAs2Emitter<L>): void {
  const name: number = cx.writePopTemp();
  cx.writePush(cx.opVar(cx.opTemp(name)));
}

function decompileIncrement<L>(cx: OpAs2Emitter<L>): void {
  const arg: number = cx.writePopTemp();
  cx.writePush(cx.binExpr(BinaryOperator.Add, cx.opTemp(arg), cx.numLit(1)));
}

function decompileInitArray<L>(cx: OpAs2Emitter<L>): void {
  const count: number = cx.writePopTemp();
  cx.writePush(cx.opInitArray(cx.opTemp(count)));
}

function decompileInitObject<L>(cx: OpAs2Emitter<L>): void {
  const count: number = cx.writePopTemp();
  cx.writePush(cx.opInitObject(cx.opTemp(count)));
}

function decompilePop(cx: OpAs2Emitter): void {
  cx.writeExpr(cx.opPop());
}

function decompilePush<L>(cx: OpAs2Emitter<L>, action: actions.Push): void {
  for (const value of action.values) {
    cx.writePush(decompilePushValue(cx, value));
  }

  function decompilePushValue<L>(cx: OpAs2Emitter<L>, value: PushValue): Expression<L> {
    switch (value.type) {
      case PushValueType.Boolean:
        return cx.boolLit(value.value);
      case PushValueType.Constant:
        return cx.opConst(value.value);
      case PushValueType.Float32:
        return cx.numLit(value.value);
      case PushValueType.Float64:
        return cx.numLit(value.value);
      case PushValueType.Null:
        return cx.nullLit();
      case PushValueType.Register:
        return cx.opReg(value.value);
      case PushValueType.Sint32:
        return cx.numLit(value.value);
      case PushValueType.String:
        return cx.strLit(value.value);
      case PushValueType.Undefined:
        return cx.opUndef();
      default:
        throw new Error("AssertionError: Unexpected PushValue type");
    }
  }
}

function decompileSetMember<L>(cx: OpAs2Emitter<L>): void {
  const value: number = cx.writePopTemp();
  const key: number = cx.writePopTemp();
  const base: number = cx.writePopTemp();
  cx.writeExpr(cx.simpleAssignment(cx.memberPattern(cx.opTemp(base), cx.opTemp(key)), cx.opTemp(value)));
}

function decompileSetProperty<L>(cx: OpAs2Emitter<L>): void {
  const value: number = cx.writePopTemp();
  const index: number = cx.writePopTemp();
  const base: number = cx.writePopTemp();
  const pattern: MemberPattern<L> = cx.memberPattern(cx.opTemp(base), cx.opPropertyName(cx.opTemp(index)));
  cx.writeExpr(cx.simpleAssignment(pattern, cx.opTemp(value)));
}

function decompileSetVariable<L>(cx: OpAs2Emitter<L>): void {
  const value: number = cx.writePopTemp();
  const name: number = cx.writePopTemp();
  cx.write(cx.setVar(cx.opTemp(name), cx.opTemp(value)));
}

function decompileStackSwap<L>(cx: OpAs2Emitter<L>): void {
  const right: number = cx.writePopTemp();
  const left: number = cx.writePopTemp();
  cx.writePush(cx.opTemp(right));
  cx.writePush(cx.opTemp(left));
}

function decompileStoreRegister<L>(cx: OpAs2Emitter<L>, action: actions.StoreRegister): void {
  const value: number = cx.writePopTemp();
  cx.writeExpr(cx.simpleAssignment(cx.opRegPattern(action.register), cx.opTemp(value)));
  cx.writePush(cx.opReg(action.register));
}

function decompileTrace(cx: OpAs2Emitter): void {
  const value: number = cx.writePopTemp();
  cx.write(cx.opTrace(cx.opTemp(value)));
}

function decompileUnaryOperation(cx: OpAs2Emitter, operator: UnaryOperator): void {
  const arg: number = cx.writePopTemp();
  cx.writePush(cx.unaryExpr(operator, cx.opTemp(arg)));
}
