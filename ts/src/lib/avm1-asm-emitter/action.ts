import { Action, ActionType, CatchTarget, CatchTargetType, GetUrl2Method, ValueType } from "avm1-tree";
import {
  ConstantPool,
  DefineFunction,
  DefineFunction2,
  GetUrl,
  GetUrl2,
  GotoFrame,
  GotoFrame2,
  GotoLabel,
  If,
  Jump,
  Push,
  SetTarget,
  StoreRegister,
  Try,
  WaitForFrame,
  WaitForFrame2,
  With,
} from "avm1-tree/actions";
import { Float32, Float64, Sint32, SintSize, Uint8 } from "semantic-types";

export function emitAction(action: Action): string {
  const chunks: string[] = [];
  writeAction(chunks, action);
  return chunks.join("");
}

const SIMPLE_ACTIONS: ReadonlyMap<ActionType, string> = new Map([
  [ActionType.Add, "add"],
  [ActionType.Add2, "add2"],
  [ActionType.And, "and"],
  [ActionType.AsciiToChar, "asciiToChar"],
  [ActionType.BitAnd, "bitAnd"],
  [ActionType.BitLShift, "bitLShift"],
  [ActionType.BitOr, "bitOr"],
  [ActionType.BitRShift, "bitRShift"],
  [ActionType.BitURShift, "bitURShift"],
  [ActionType.BitXor, "bitXor"],
  [ActionType.Call, "call"],
  [ActionType.CallFunction, "callFunction"],
  [ActionType.CallMethod, "callMethod"],
  [ActionType.CastOp, "castOp"],
  [ActionType.CharToAscii, "charToAscii"],
  [ActionType.CloneSprite, "cloneSprite"],
  [ActionType.Decrement, "decrement"],
  [ActionType.DefineLocal, "defineLocal"],
  [ActionType.DefineLocal2, "defineLocal2"],
  [ActionType.Delete, "delete"],
  [ActionType.Delete2, "delete"],
  [ActionType.Divide, "divide"],
  [ActionType.EndDrag, "endDrag"],
  [ActionType.Enumerate, "enumarate"],
  [ActionType.Enumerate2, "enumerate2"],
  [ActionType.Equals, "equals"],
  [ActionType.Equals2, "equals2"],
  [ActionType.Extends, "extends"],
  [ActionType.FsCommand2, "fsCommand2"],
  [ActionType.GetMember, "getMember"],
  [ActionType.GetProperty, "getProperty"],
  [ActionType.GetTime, "getTime"],
  [ActionType.GetVariable, "getVariable"],
  [ActionType.Greater, "greater"],
  [ActionType.ImplementsOp, "implementsOp"],
  [ActionType.InitArray, "initArray"],
  [ActionType.InitObject, "initObject"],
  [ActionType.InstanceOf, "instanceOf"],
  [ActionType.Less, "less"],
  [ActionType.Less2, "less2"],
  [ActionType.MbAsciiToChar, "mbAsciiToChar"],
  [ActionType.MbCharToAscii, "mbCharToAscii"],
  [ActionType.MbStringExtract, "mbStringExtract"],
  [ActionType.MbStringLength, "mbStringLength"],
  [ActionType.Modulo, "modulo"],
  [ActionType.Multiply, "multiply"],
  [ActionType.NewMethod, "newMethod"],
  [ActionType.NewObject, "newObject"],
  [ActionType.NextFrame, "nextFrame"],
  [ActionType.Not, "not"],
  [ActionType.Or, "or"],
  [ActionType.Play, "play"],
  [ActionType.Pop, "pop"],
  [ActionType.PreviousFrame, "previousFrame"],
  [ActionType.PushDuplicate, "pushDuplicate"],
  [ActionType.RandomNumber, "randomNumber"],
  [ActionType.RemoveSprite, "removeSprite"],
  [ActionType.Return, "return"],
  [ActionType.SetMember, "setMember"],
  [ActionType.SetProperty, "setProperty"],
  [ActionType.SetTarget2, "setTarget2"],
  [ActionType.SetVariable, "setVariable"],
  [ActionType.StackSwap, "stackSwap"],
  [ActionType.StartDrag, "startDrag"],
  [ActionType.Stop, "stop"],
  [ActionType.StopSounds, "stopSounds"],
  [ActionType.StrictEquals, "strictEquals"],
  [ActionType.StrictMode, "strictMode"],
  [ActionType.StringAdd, "stringAdd"],
  [ActionType.StringEquals, "stringEquals"],
  [ActionType.StringExtract, "stringExtract"],
  [ActionType.StringGreater, "stringGreater"],
  [ActionType.StringLength, "stringLength"],
  [ActionType.StringLess, "stringLess"],
  [ActionType.Subtract, "subtract"],
  [ActionType.TargetPath, "targetPath"],
  [ActionType.Throw, "throw"],
  [ActionType.ToggleQuality, "toggleQuality"],
  [ActionType.ToInteger, "toInteger"],
  [ActionType.ToNumber, "toNumber"],
  [ActionType.ToString, "toString"],
  [ActionType.Trace, "trace"],
  [ActionType.TypeOf, "typeOf"],
  [ActionType.WaitForFrame, "waitForFrame"],
]);

function writeAction(chunks: string[], action: Action): void {
  const simpleAction: string | undefined = SIMPLE_ACTIONS.get(action.action);
  if (simpleAction !== undefined) {
    chunks.push(simpleAction);
    return;
  }

  switch (action.action) {
    case ActionType.ConstantPool:
      writeConstantPool(chunks, action);
      break;
    case ActionType.DefineFunction:
      writeDefineFunction(chunks, action);
      break;
    case ActionType.DefineFunction2:
      writeDefineFunction2(chunks, action);
      break;
    case ActionType.GetUrl:
      writeGetUrl(chunks, action);
      break;
    case ActionType.GetUrl2:
      writeGetUrl2(chunks, action);
      break;
    case ActionType.GotoFrame:
      writeGotoFrame(chunks, action);
      break;
    case ActionType.GotoFrame2:
      writeGotoFrame2(chunks, action);
      break;
    case ActionType.GotoLabel:
      writeGotoLabel(chunks, action);
      break;
    case ActionType.If:
      writeIf(chunks, action);
      break;
    case ActionType.Jump:
      writeJump(chunks, action);
      break;
    case ActionType.Push:
      writePush(chunks, action);
      break;
    case ActionType.SetTarget:
      writeSetTarget(chunks, action);
      break;
    case ActionType.StoreRegister:
      writeStoreRegister(chunks, action);
      break;
    case ActionType.Try:
      writeTry(chunks, action);
      break;
    case ActionType.WaitForFrame:
      writeWaitForFrame(chunks, action);
      break;
    case ActionType.WaitForFrame2:
      writeWaitForFrame2(chunks, action);
      break;
    case ActionType.With:
      writeWith(chunks, action);
      break;
    default:
      throw new Error("Unknown action");
  }
}

function writeConstantPool(chunks: string[], action: ConstantPool): void {
  chunks.push("constantPool");
  chunks.push("(");
  for (const [i, val] of action.constantPool.entries()) {
    if (i !== 0) {
      chunks.push(",");
    }
    chunks.push("\n  ");
    writeUcs2StringLiteral(chunks, val);
  }
  chunks.push("\n)");
}

function writeDefineFunction(chunks: string[], action: DefineFunction): void {
  chunks.push("defineFunction");
  chunks.push("(");
  chunks.push("name=");
  writeUcs2StringLiteral(chunks, action.name);
  for (const param of action.parameters) {
    chunks.push(",");
    writeUcs2StringLiteral(chunks, param);
  }
  chunks.push(")");
  chunks.push("{...}");
}

function writeDefineFunction2(chunks: string[], action: DefineFunction2): void {
  chunks.push("defineFunction2");
  chunks.push("(");
  chunks.push("name=");
  writeUcs2StringLiteral(chunks, action.name);
  chunks.push(",");
  chunks.push("preloadParent=");
  writeBooleanLiteral(chunks, action.preloadParent);
  chunks.push(",");
  chunks.push("preloadRoot=");
  writeBooleanLiteral(chunks, action.preloadRoot);
  chunks.push(",");
  chunks.push("suppressSuper=");
  writeBooleanLiteral(chunks, action.suppressSuper);
  chunks.push(",");
  chunks.push("preloadSuper=");
  writeBooleanLiteral(chunks, action.preloadSuper);
  chunks.push(",");
  chunks.push("suppressArguments=");
  writeBooleanLiteral(chunks, action.suppressArguments);
  chunks.push(",");
  chunks.push("preloadArguments=");
  writeBooleanLiteral(chunks, action.preloadArguments);
  chunks.push(",");
  chunks.push("suppressThis=");
  writeBooleanLiteral(chunks, action.suppressThis);
  chunks.push(",");
  chunks.push("preloadThis=");
  writeBooleanLiteral(chunks, action.preloadThis);
  chunks.push(",");
  chunks.push("preloadGlobal=");
  writeBooleanLiteral(chunks, action.preloadGlobal);
  chunks.push(",");
  chunks.push("registerCount=");
  writeSintSizeLiteral(chunks, action.registerCount);
  for (const param of action.parameters) {
    chunks.push(",");
    writeRegister(chunks, param.register);
    chunks.push("=");
    writeIdentifier(chunks, param.name);
  }
  chunks.push(")");
  chunks.push("{...}");
}

function writeGetUrl(chunks: string[], action: GetUrl): void {
  chunks.push("getUrl");
  chunks.push("(");
  chunks.push("url=");
  writeUcs2StringLiteral(chunks, action.url);
  chunks.push(",");
  chunks.push("target=");
  writeUcs2StringLiteral(chunks, action.target);
  chunks.push(")");
}

function writeGetUrl2(chunks: string[], action: GetUrl2): void {
  chunks.push("getUrl2");
  chunks.push("(");
  chunks.push("method=");
  switch (action.method) {
    case GetUrl2Method.None:
      chunks.push("none");
      break;
    case GetUrl2Method.Get:
      chunks.push("get");
      break;
    case GetUrl2Method.Post:
      chunks.push("post");
      break;
    default:
      throw new Error(`Unknown GetUrl2Method value: ${action.method}`);
  }
  chunks.push(",");
  chunks.push("loadTarget=");
  writeBooleanLiteral(chunks, action.loadTarget);
  chunks.push(",");
  chunks.push("loadVariables=");
  writeBooleanLiteral(chunks, action.loadVariables);
  chunks.push(")");
}

function writeGotoFrame(chunks: string[], action: GotoFrame): void {
  chunks.push("gotoFrame");
  chunks.push("(");
  chunks.push("frame=");
  writeSintSizeLiteral(chunks, action.frame);
  chunks.push(")");
}

function writeGotoFrame2(chunks: string[], action: GotoFrame2): void {
  chunks.push("gotoFrame2");
  chunks.push("(");
  chunks.push("play=");
  writeBooleanLiteral(chunks, action.play);
  chunks.push(",");
  chunks.push("sceneBias=");
  writeSintSizeLiteral(chunks, action.sceneBias);
  chunks.push(")");
}

function writeGotoLabel(chunks: string[], action: GotoLabel): void {
  chunks.push("gotoLabel");
  chunks.push("(");
  chunks.push("label=");
  writeUcs2StringLiteral(chunks, action.label);
  chunks.push(")");
}

function writeIf(chunks: string[], action: If): void {
  chunks.push("if");
  chunks.push("(");
  chunks.push("offset=");
  writeSintSizeLiteral(chunks, action.offset);
  chunks.push(")");
}

function writeJump(chunks: string[], action: Jump): void {
  chunks.push("jump");
  chunks.push("(");
  chunks.push("offset=");
  writeSintSizeLiteral(chunks, action.offset);
  chunks.push(")");
}

function writePush(chunks: string[], action: Push): void {
  chunks.push("push");
  chunks.push("(");
  for (const [i, val] of action.values.entries()) {
    if (i !== 0) {
      chunks.push(",");
    }
    switch (val.type) {
      case ValueType.Boolean:
        writeBooleanLiteral(chunks, val.value);
        break;
      case ValueType.Constant:
        writeConstant(chunks, val.value);
        break;
      case ValueType.Float32:
        writeFloat32Literal(chunks, val.value);
        break;
      case ValueType.Float64:
        writeFloat64Literal(chunks, val.value);
        break;
      case ValueType.Null:
        chunks.push("null");
        break;
      case ValueType.Register:
        writeRegister(chunks, val.value);
        break;
      case ValueType.Sint32:
        writeSint32Literal(chunks, val.value);
        break;
      case ValueType.String:
        writeUcs2StringLiteral(chunks, val.value);
        break;
      case ValueType.Undefined:
        chunks.push("undefined");
        break;
      default:
        throw new Error(`Unknown ValueType value: ${(val as any).type}`);
    }
  }
  chunks.push(")");
}

function writeSetTarget(chunks: string[], action: SetTarget): void {
  chunks.push("setTarget");
  chunks.push("(");
  chunks.push("targetName=");
  writeUcs2StringLiteral(chunks, action.targetName);
  chunks.push(")");
}

function writeStoreRegister(chunks: string[], action: StoreRegister): void {
  chunks.push("setTarget2");
  chunks.push("(");
  chunks.push("register=");
  writeRegister(chunks, action.register);
  chunks.push(")");
}

function writeTry(chunks: string[], action: Try): void {
  chunks.push("try");
  chunks.push("{...}");
  if (action.catch !== undefined) {
    chunks.push("catch");
    chunks.push("(");
    const catchTarget: CatchTarget = action.catchTarget;
    switch (catchTarget.type) {
      case CatchTargetType.Register:
        writeRegister(chunks, catchTarget.register);
        break;
      case CatchTargetType.Variable:
        writeIdentifier(chunks, catchTarget.variable);
        break;
      default:
        throw new Error(`Unknown CatchTargetType value: ${(catchTarget as any).type}`);
    }
    chunks.push(")");
    chunks.push("{...}");
  }
  if (action.finally !== undefined) {
    chunks.push("finally");
    chunks.push("{...}");
  }
}

function writeWaitForFrame(chunks: string[], action: WaitForFrame): void {
  chunks.push("waitForFrame");
  chunks.push("(");
  chunks.push("frame=");
  writeSintSizeLiteral(chunks, action.frame);
  chunks.push(",");
  chunks.push("skipCount=");
  writeSintSizeLiteral(chunks, action.skipCount);
  chunks.push(")");
}

function writeWaitForFrame2(chunks: string[], action: WaitForFrame2): void {
  chunks.push("waitForFrame2");
  chunks.push("(");
  chunks.push("skipCount=");
  writeSintSizeLiteral(chunks, action.skipCount);
  chunks.push(")");
}

function writeWith(chunks: string[], action: With): void {
  chunks.push("with");
  chunks.push("{...}");
}

function writeConstant(chunks: string[], id: Uint8): void {
  chunks.push("c:");
  writeSintSizeLiteral(chunks, id);
}

function writeRegister(chunks: string[], id: Uint8): void {
  chunks.push("r:");
  writeSintSizeLiteral(chunks, id);
}

function writeIdentifier(chunks: string[], name: string): void {
  chunks.push("i:");
  writeUcs2StringLiteral(chunks, name);
}

function writeUcs2StringLiteral(chunks: string[], value: string): void {
  chunks.push(JSON.stringify(value));
}

function writeBooleanLiteral(chunks: string[], value: boolean): void {
  chunks.push(value ? "true" : "false");
}

function writeSintSizeLiteral(chunks: string[], value: SintSize): void {
  chunks.push(value.toString(10));
}

function writeFloat32Literal(chunks: string[], value: Float32): void {
  chunks.push(value.toString(10));
  chunks.push("f32");
}

function writeFloat64Literal(chunks: string[], value: Float64): void {
  chunks.push(value.toString(10));
  chunks.push("f64");
}

function writeSint32Literal(chunks: string[], value: Sint32): void {
  chunks.push(value.toString(10));
  chunks.push("s32");
}
