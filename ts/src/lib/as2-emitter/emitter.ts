import { AssignmentOperator } from "../as2-types/assignment-operator";
import { BinaryOperator } from "../as2-types/binary-operator";
import { Expression } from "../as2-types/expression";
import { AssignmentExpression } from "../as2-types/expressions/assignment-expression";
import { BinaryExpression } from "../as2-types/expressions/binary-expression";
import { BooleanLiteral } from "../as2-types/expressions/boolean-literal";
import { CallExpression } from "../as2-types/expressions/call-expression";
import { Identifier } from "../as2-types/expressions/identifier";
import { MemberExpression } from "../as2-types/expressions/member-expression";
import { NumberLiteral } from "../as2-types/expressions/number-literal";
import { StringLiteral } from "../as2-types/expressions/string-literal";
import { UnaryExpression } from "../as2-types/expressions/unary-expression";
import { OpConstant } from "../as2-types/op-expressions/op-constant";
import { OpPropertyName } from "../as2-types/op-expressions/op-property-name";
import { OpRegister } from "../as2-types/op-expressions/op-register";
import { OpTemporary } from "../as2-types/op-expressions/op-temporary";
import { OpVariable } from "../as2-types/op-expressions/op-variable";
import { OpRegisterPattern } from "../as2-types/op-patterns/op-register-pattern";
import { OpTemporaryPattern } from "../as2-types/op-patterns/op-temporary-pattern";
import { OpConstantPool } from "../as2-types/op-statements/op-constant-pool";
import { OpDeclareVariable } from "../as2-types/op-statements/op-declare-variable";
import { OpInitArray } from "../as2-types/op-statements/op-init-array";
import { OpInitObject } from "../as2-types/op-statements/op-init-object";
import { OpPush } from "../as2-types/op-statements/op-push";
import { OpTrace } from "../as2-types/op-statements/op-trace";
import { Pattern } from "../as2-types/pattern";
import { MemberPattern } from "../as2-types/patterns/member-pattern";
import { Script } from "../as2-types/script";
import { Statement } from "../as2-types/statement";
import { ExpressionStatement } from "../as2-types/statements/expression-statement";
import { SetVariable } from "../as2-types/statements/set-variable";
import { UnaryOperator } from "../as2-types/unary-operator";

export function emitScript(script: Script<unknown>): string {
  const chunks: string[] = [];
  const emitter: As2Emitter = new As2Emitter(chunks);
  emitter.writeScript(script);
  return chunks.join("");
}

enum QuoteType {
  Simple,
  Double,
}

class As2Emitter {
  private out: string[];
  private depth: number;
  private space: string;
  private quotes: QuoteType;

  constructor(out: string[], depth: number = 0, indent: string = "  ", quotes: QuoteType = QuoteType.Double) {
    this.out = out;
    this.depth = depth;
    this.space = indent;
    this.quotes = quotes;
  }

  writeScript(script: Script<unknown>): void {
    for (const statement of script.body) {
      this.writeStatement(statement);
    }
  }

  writeStatement(statement: Statement<unknown>): void {
    switch (statement.type) {
      case "BlockStatement":
        throw new Error("NotImplemented");
      case "EmptyStatement":
        return this.writeEmptyStatement();
      case "ExpressionStatement":
        return this.writeExpressionStatement(statement);
      case "IfFrameLoadedStatement":
        throw new Error("NotImplemented");
      case "IfStatement":
        throw new Error("NotImplemented");
      case "OpConstantPool":
        return this.writeOpConstantPool(statement);
      case "OpDeclareVariable":
        return this.writeOpDeclareVariable(statement);
      case "OpEnumerate":
        throw new Error("NotImplemented");
      case "OpInitArray":
        return this.writeOpInitArray(statement);
      case "OpInitObject":
        return this.writeOpInitObject(statement);
      case "OpPush":
        return this.writeOpPush(statement);
      case "OpTrace":
        return this.writeOpTrace(statement);
      case "ReturnStatement":
        throw new Error("NotImplemented");
      case "SetVariable":
        return this.writeSetVariable(statement);
      case "ThrowStatement":
        throw new Error("NotImplemented");
      default:
        throw new Error("AssertionError: Unexpected Statement type");
    }
  }

  writeEmptyStatement(): void {
    this.write(";");
    this.endStatement();
  }

  writeExpressionStatement(statement: ExpressionStatement<unknown>): void {
    this.writeExpression(statement.expression);
    this.write(";");
    this.endStatement();
  }

  writeOpConstantPool(statement: OpConstantPool<unknown>): void {
    this.write("@constantPool(\n");
    this.indent();
    let first: boolean = true;
    for (const constant of statement.pool) {
      if (first) {
        first = false;
      } else {
        this.write(",\n");
      }
      this.writeIndentation();
      this.writeStringLiteral(constant);
    }
    this.write("\n");
    this.dedent();
    this.writeIndentation();
    this.write(");");
    this.endStatement();
  }

  writeOpDeclareVariable(statement: OpDeclareVariable<unknown>): void {
    this.write("@declareVar(");
    this.writeExpression(statement.name);
    if (statement.value !== null) {
      this.write(", ");
      this.writeExpression(statement.name);
    }
    this.write(");");
    this.endStatement();
  }

  writeOpInitArray(statement: OpInitArray<unknown>): void {
    if (statement.target !== null) {
      this.writeOpTemporaryPattern(statement.target);
      this.write(" = ");
    }
    this.write("@array(");
    this.writeExpression(statement.itemCount);
    this.write(")");
  }

  writeOpInitObject(statement: OpInitObject<unknown>): void {
    if (statement.target !== null) {
      this.writeOpTemporaryPattern(statement.target);
      this.write(" = ");
    }
    this.write("@object(");
    this.writeExpression(statement.itemCount);
    this.write(")");
  }

  writeOpPush(statement: OpPush<unknown>): void {
    this.write("@push(");
    this.writeExpression(statement.value);
    this.write(");");
    this.endStatement();
  }

  writeSetVariable(expression: SetVariable<unknown>): void {
    this.write("set(");
    this.writeExpression(expression.name);
    this.write(", ");
    this.writeExpression(expression.value);
    this.write(")");
  }

  writeOpTrace(statement: OpTrace<unknown>): void {
    this.write("@trace(");
    this.writeExpression(statement.value);
    this.write(");");
    this.endStatement();
  }

  writeExpression(expression: Expression<unknown>): void {
    switch (expression.type) {
      case "AssignmentExpression":
        return this.writeAssignmentExpression(expression);
      case "BinaryExpression":
        return this.writeBinaryExpression(expression);
      case "BooleanLiteral":
        return this.writeBooleanLiteral(expression);
      case "CallExpression":
        return this.writeCallExpression(expression);
      case "ConditionalExpression":
        throw new Error("NotImplemented");
      case "Identifier":
        return this.writeIdentifier(expression);
      case "LogicalExpression":
        throw new Error("NotImplemented");
      case "MemberExpression":
        return this.writeMemberExpression(expression);
      case "NewExpression":
        throw new Error("NotImplemented");
      case "NullLiteral":
        return this.writeNullLiteral();
      case "NumberLiteral":
        return this.writeNumberLiteral(expression);
      case "OpConstant":
        return this.writeOpConstant(expression);
      case "OpGlobal":
        return this.writeOpGlobal();
      case "OpPop":
        return this.writeOpPop();
      case "OpPropertyName":
        return this.writeOpPropertyName(expression);
      case "OpRegister":
        return this.writeOpRegister(expression);
      case "OpTemporary":
        return this.writeOpTemporary(expression);
      case "OpUndefined":
        return this.writeOpUndefined();
      case "OpVariable":
        return this.writeOpVariable(expression);
      case "SequenceExpression":
        throw new Error("NotImplemented");
      case "StringLiteral":
        return this.writeStringLiteral(expression);
      case "UnaryExpression":
        return this.writeUnaryExpression(expression);
      default:
        throw new Error("AssertionError: Unexpected Expression type");
    }
  }

  writeAssignmentExpression(expression: AssignmentExpression<unknown>): void {
    this.writePattern(expression.target);
    this.write(" ");
    switch (expression.operator) {
      case AssignmentOperator.Add:
        this.write("+=");
        break;
      case AssignmentOperator.Simple:
        this.write("=");
        break;
      default:
          throw new Error("AssertionError: Unexpected AssignmentOperator type");
    }
    this.write(" (");
    this.writeExpression(expression.value);
    this.write(")");
  }

  writeBinaryExpression(expression: BinaryExpression<unknown>): void {
    this.write("(");
    this.writeExpression(expression.left);
    this.write(") ");
    switch (expression.operator) {
      case BinaryOperator.Add:
        this.write("+");
        break;
      case BinaryOperator.BitAnd:
        this.write("&");
        break;
      case BinaryOperator.BitOr:
        this.write("|");
        break;
      case BinaryOperator.BitXor:
        this.write("^");
        break;
      case BinaryOperator.Divide:
        this.write("/");
        break;
      case BinaryOperator.Equals:
        this.write("==");
        break;
      case BinaryOperator.Greater:
        this.write(">");
        break;
      case BinaryOperator.InstanceOf:
        this.write("instanceof");
        break;
      case BinaryOperator.LegacyAdd:
        this.write("add");
        break;
      case BinaryOperator.LeftShift:
        this.write("<<");
        break;
      case BinaryOperator.Less:
        this.write("<");
        break;
      case BinaryOperator.Multiply:
        this.write("*");
        break;
      case BinaryOperator.NotEquals:
        this.write("!=");
        break;
      case BinaryOperator.NotStrictEquals:
        this.write("!==");
        break;
      case BinaryOperator.Remainder:
        this.write("%");
        break;
      case BinaryOperator.SignedRightShift:
        this.write(">>");
        break;
      case BinaryOperator.Subtract:
        this.write("-");
        break;
      case BinaryOperator.StrictEquals:
        this.write("===");
        break;
      case BinaryOperator.UnsignedRightShift:
        this.write(">>>");
        break;
      default:
        throw new Error("AssertionError: Unexpected BinaryOperator type");
    }
    this.write(" (");
    this.writeExpression(expression.right);
    this.write(")");
  }

  writeBooleanLiteral(expression: BooleanLiteral<unknown>): void {
    this.writeBoolean(expression.value);
  }

  writeCallExpression(expression: CallExpression<unknown>): void {
    this.write("(");
    this.writeExpression(expression.callee);
    this.write(")(");
    let first: boolean = true;
    for (const arg of expression.arguments) {
      if (first) {
        first = false;
      } else {
        this.write(", ");
      }
      this.write("(");
      this.writeExpression(arg);
      this.write(")");
    }
    this.write(")");
  }

  writeIdentifier(expression: Identifier): void {
    this.write(expression.name);
  }

  writeMemberExpression(expression: MemberExpression): void {
    this.write("(");
    this.writeExpression(expression.base);
    this.write(")[");
    this.writeExpression(expression.key);
    this.write("]");
  }

  writeNullLiteral(): void {
    this.write("null");
  }

  writeNumberLiteral(expression: NumberLiteral<unknown>): void {
    this.writeNumber(expression.value);
  }

  writeOpConstant(expression: OpConstant<unknown>): void {
    this.write(`@c${expression.id}`);
  }

  writeOpGlobal(): void {
    this.write("@global");
  }

  writeOpPop(): void {
    this.write("@pop()");
  }

  writeOpPropertyName(expression: OpPropertyName<unknown>): void {
    this.write("@propertyName(");
    this.writeExpression(expression.index);
    this.write(")");
  }

  writeOpRegister(expression: OpRegister<unknown>): void {
    this.write(`@r${expression.id}`);
  }

  writeOpTemporary(expression: OpTemporary<unknown>): void {
    this.write(`@t${expression.id}`);
  }

  writeOpUndefined(): void {
    this.write("@undefined");
  }

  writeOpVariable(expression: OpVariable<unknown>): void {
    this.write("@var(");
    this.writeExpression(expression.name);
    this.write(")");
  }

  writeStringLiteral(expression: StringLiteral<unknown>): void {
    this.writeString(expression.value);
  }

  writeUnaryExpression(expression: UnaryExpression<unknown>): void {
    switch (expression.operator) {
      case UnaryOperator.BitNot:
        this.write("~");
        break;
      case UnaryOperator.Delete:
        this.write("delete ");
        break;
      case UnaryOperator.LogicalNot:
        this.write("!");
        break;
      case UnaryOperator.TypeOf:
        this.write("typeof ");
        break;
      case UnaryOperator.Void:
        this.write("void ");
        break;
      default:
        throw new Error("AssertionError: Unexpected UnaryExpression type");
    }
    this.write("(");
    this.writeExpression(expression.argument);
    this.write(")");
  }

  writePattern(pattern: Pattern<unknown>): void {
    switch (pattern.type) {
      case "IdentifierPattern":
        throw new Error("NotImplemented");
      case "MemberPattern":
        return this.writeMemberPattern(pattern);
      case "OpRegisterPattern":
        return this.writeOpRegisterPattern(pattern);
      case "OpTemporaryPattern":
        return this.writeOpTemporaryPattern(pattern);
      default:
        throw new Error("AssertionError: Unexpected Pattern type");
    }
  }

  writeMemberPattern(expression: MemberPattern<unknown>): void {
    this.write(" (");
    this.writeExpression(expression.base);
    this.write(")[");
    this.writeExpression(expression.key);
    this.write("]");
  }

  writeOpRegisterPattern(pattern: OpRegisterPattern<unknown>): void {
    this.write(`@r${pattern.id}`);
  }

  writeOpTemporaryPattern(pattern: OpTemporaryPattern<unknown>): void {
    this.write(`@t${pattern.id}`);
  }

  private writeBoolean(value: boolean): void {
    this.write(value ? "true" : "false");
  }

  private writeNumber(value: number): void {
    this.write(value.toString(10));
  }

  private writeString(value: string): void {
    if (this.quotes === QuoteType.Double) {
      // TODO: Avoid `JSON.stringify` (implement escape logic manually).
      this.write(JSON.stringify(value));
    } else {
      throw new Error("NotImplemented: writeStringLiteral (with simple quotes");
    }
  }

  private write(str: string): void {
    this.out.push(str);
  }

  private indent(): void {
    this.depth++;
  }

  private dedent(): void {
    this.depth--;
  }

  private writeIndentation(): void {
    for (let _: number = 0; _ < this.depth; _++) {
      this.write(this.space);
    }
  }

  private endStatement(): void {
    this.write("\n");
  }
}
