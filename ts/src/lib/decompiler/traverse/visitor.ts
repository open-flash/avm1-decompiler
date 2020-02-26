import { RoExpression } from "../../as2-types/expression";
import { RoAssignmentExpression } from "../../as2-types/expressions/assignment-expression";
import { RoBinaryExpression } from "../../as2-types/expressions/binary-expression";
import { RoBooleanLiteral } from "../../as2-types/expressions/boolean-literal";
import { RoCallExpression } from "../../as2-types/expressions/call-expression";
import { RoConditionalExpression } from "../../as2-types/expressions/conditional-expression";
import { RoIdentifier } from "../../as2-types/expressions/identifier";
import { RoLogicalExpression } from "../../as2-types/expressions/logical-expression";
import { RoMemberExpression } from "../../as2-types/expressions/member-expression";
import { RoNewExpression } from "../../as2-types/expressions/new-expression";
import { RoNullLiteral } from "../../as2-types/expressions/null-literal";
import { RoNumberLiteral } from "../../as2-types/expressions/number-literal";
import { RoSequenceExpression } from "../../as2-types/expressions/sequence-expression";
import { RoStringLiteral } from "../../as2-types/expressions/string-literal";
import { RoUnaryExpression } from "../../as2-types/expressions/unary-expression";
import { RoNode } from "../../as2-types/node";
import { RoOpConstant } from "../../as2-types/op-expressions/op-constant";
import { RoOpGlobal } from "../../as2-types/op-expressions/op-global";
import { RoOpPop } from "../../as2-types/op-expressions/op-pop";
import { RoOpPropertyName } from "../../as2-types/op-expressions/op-property-name";
import { RoOpRegister } from "../../as2-types/op-expressions/op-register";
import { RoOpTemporary } from "../../as2-types/op-expressions/op-temporary";
import { RoOpUndefined } from "../../as2-types/op-expressions/op-undefined";
import { RoOpVariable } from "../../as2-types/op-expressions/op-variable";
import { RoOpRegisterPattern } from "../../as2-types/op-patterns/op-register-pattern";
import { RoOpTemporaryPattern } from "../../as2-types/op-patterns/op-temporary-pattern";
import { RoOpCallFunction } from "../../as2-types/op-statements/op-call-function";
import { RoOpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { RoOpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { RoOpEnumerate } from "../../as2-types/op-statements/op-enumerate";
import { RoOpInitArray } from "../../as2-types/op-statements/op-init-array";
import { RoOpInitObject } from "../../as2-types/op-statements/op-init-object";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { RoPattern } from "../../as2-types/pattern";
import { RoIdentifierPattern } from "../../as2-types/patterns/identifier-pattern";
import { RoMemberPattern } from "../../as2-types/patterns/member-pattern";
import { RoScript } from "../../as2-types/script";
import { RoStatement } from "../../as2-types/statement";
import { RoBlockStatement } from "../../as2-types/statements/block-statement";
import { RoEmptyStatement } from "../../as2-types/statements/empty-statement";
import { RoExpressionStatement } from "../../as2-types/statements/expression-statement";
import { RoIfFrameLoadedStatement } from "../../as2-types/statements/if-frame-loaded-statement";
import { RoIfStatement } from "../../as2-types/statements/if-statement";
import { RoReturnStatement } from "../../as2-types/statements/return-statement";
import { RoSetVariable } from "../../as2-types/statements/set-variable";
import { RoThrowStatement } from "../../as2-types/statements/throw-statement";
import { Path } from "./path";

export enum VisitorAction {
  /**
   * Advance to the next node in the traversal.
   */
  Advance,

  /**
   * Skip all sub-trees of the current node.
   */
  Skip,

  /**
   * Stop the traversal.
   */
  Stop,
}

export type Visitor<L, S> = AnyNodeVisitor<L, S> | TypedNodeVisitor<L, S>;

export interface AnyNodeVisitor<L, S> {
  node: VisitorObj<RoNode<L>, S>;
  script?: undefined;
  statement?: undefined;
  blockStatement?: undefined;
  emptyStatement?: undefined;
  expressionStatement?: undefined;
  ifFrameLoadedStatement?: undefined;
  ifStatement?: undefined;
  opCallFunction?: undefined;
  opConstantPool?: undefined;
  opDeclareVariable?: undefined;
  opEnumerate?: undefined;
  opInitArray?: undefined;
  opInitObject?: undefined;
  opPush?: undefined;
  opTrace?: undefined;
  returnStatement?: undefined;
  setVariable?: undefined;
  throwStatement?: undefined;
  expression?: undefined;
  assignmentExpression?: undefined;
  binaryExpression?: undefined;
  booleanLiteral?: undefined;
  callExpression?: undefined;
  conditionalExpression?: undefined;
  identifier?: undefined;
  logicalExpression?: undefined;
  memberExpression?: undefined;
  newExpression?: undefined;
  nullLiteral?: undefined;
  numberLiteral?: undefined;
  opConstant?: undefined;
  opGlobal?: undefined;
  opPop?: undefined;
  opPropertyName?: undefined;
  opRegister?: undefined;
  opTemporary?: undefined;
  opUndefined?: undefined;
  opVariable?: undefined;
  sequenceExpression?: undefined;
  stringLiteral?: undefined;
  unaryExpression?: undefined;
  pattern?: undefined;
  identifierPattern?: undefined;
  memberPattern?: undefined;
  opRegisterPattern?: undefined;
  opTemporaryPattern?: undefined;
}

export type TypedNodeVisitor<L, S> =
  ScriptVisitor<L, S> & StatementVisitor<L, S> & ExpressionVisitor<L, S> & PatternVisitor<L, S>;

export interface ScriptVisitor<L, S> {
  node: undefined;
  script?: VisitorObj<RoScript<L>, S>;
}

export type StatementVisitor<L, S> = AnyStatementVisitor<L, S> | TypedStatementVisitor<L, S>;

export interface AnyStatementVisitor<L, S> {
  node: undefined;
  statement?: VisitorObj<RoStatement<L>, S>;
  blockStatement?: undefined;
  emptyStatement?: undefined;
  expressionStatement?: undefined;
  ifFrameLoadedStatement?: undefined;
  ifStatement?: undefined;
  opCallFunction?: undefined;
  opConstantPool?: undefined;
  opDeclareVariable?: undefined;
  opEnumerate?: undefined;
  opInitArray?: undefined;
  opInitObject?: undefined;
  opPush?: undefined;
  opTrace?: undefined;
  returnStatement?: undefined;
  setVariable?: undefined;
  throwStatement?: undefined;
}

export interface TypedStatementVisitor<L, S> {
  node: undefined;
  statement: undefined;
  blockStatement?: VisitorObj<RoBlockStatement<L>, S>;
  emptyStatement?: VisitorObj<RoEmptyStatement<L>, S>;
  expressionStatement?: VisitorObj<RoExpressionStatement<L>, S>;
  ifFrameLoadedStatement?: VisitorObj<RoIfFrameLoadedStatement<L>, S>;
  ifStatement?: VisitorObj<RoIfStatement<L>, S>;
  opCallFunction?: VisitorObj<RoOpCallFunction<L>, S>;
  opConstantPool?: VisitorObj<RoOpConstantPool<L>, S>;
  opDeclareVariable?: VisitorObj<RoOpDeclareVariable<L>, S>;
  opEnumerate?: VisitorObj<RoOpEnumerate<L>, S>;
  opInitArray?: VisitorObj<RoOpInitArray<L>, S>;
  opInitObject?: VisitorObj<RoOpInitObject<L>, S>;
  opPush?: VisitorObj<RoOpPush<L>, S>;
  opTrace?: VisitorObj<RoOpTrace<L>, S>;
  returnStatement?: VisitorObj<RoReturnStatement<L>, S>;
  setVariable?: VisitorObj<RoSetVariable<L>, S>;
  throwStatement?: VisitorObj<RoThrowStatement<L>, S>;
}

export type ExpressionVisitor<L, S> = AnyExpressionVisitor<L, S> | TypedExpressionVisitor<L, S>;

export interface AnyExpressionVisitor<L, S> {
  node?: undefined;
  expression?: VisitorObj<RoExpression<L>, S>;
  assignmentExpression?: undefined;
  binaryExpression?: undefined;
  booleanLiteral?: undefined;
  callExpression?: undefined;
  conditionalExpression?: undefined;
  identifier?: undefined;
  logicalExpression?: undefined;
  memberExpression?: undefined;
  newExpression?: undefined;
  nullLiteral?: undefined;
  numberLiteral?: undefined;
  opConstant?: undefined;
  opGlobal?: undefined;
  opPop?: undefined;
  opPropertyName?: undefined;
  opRegister?: undefined;
  opTemporary?: undefined;
  opUndefined?: undefined;
  opVariable?: undefined;
  sequenceExpression?: undefined;
  stringLiteral?: undefined;
  unaryExpression?: undefined;
}

export interface TypedExpressionVisitor<L, S> {
  node: undefined;
  expression: undefined;
  assignmentExpression?: VisitorObj<RoAssignmentExpression<L>, S>;
  binaryExpression?: VisitorObj<RoBinaryExpression<L>, S>;
  booleanLiteral?: VisitorObj<RoBooleanLiteral<L>, S>;
  callExpression?: VisitorObj<RoCallExpression<L>, S>;
  conditionalExpression?: VisitorObj<RoConditionalExpression<L>, S>;
  identifier?: VisitorObj<RoIdentifier<L>, S>;
  logicalExpression?: VisitorObj<RoLogicalExpression<L>, S>;
  memberExpression?: VisitorObj<RoMemberExpression<L>, S>;
  newExpression?: VisitorObj<RoNewExpression<L>, S>;
  nullLiteral?: VisitorObj<RoNullLiteral<L>, S>;
  numberLiteral?: VisitorObj<RoNumberLiteral<L>, S>;
  opConstant?: VisitorObj<RoOpConstant<L>, S>;
  opGlobal?: VisitorObj<RoOpGlobal<L>, S>;
  opPop?: VisitorObj<RoOpPop<L>, S>;
  opPropertyName?: VisitorObj<RoOpPropertyName<L>, S>;
  opRegister?: VisitorObj<RoOpRegister<L>, S>;
  opTemporary?: VisitorObj<RoOpTemporary<L>, S>;
  opUndefined?: VisitorObj<RoOpUndefined<L>, S>;
  opVariable?: VisitorObj<RoOpVariable<L>, S>;
  sequenceExpression?: VisitorObj<RoSequenceExpression<L>, S>;
  stringLiteral?: VisitorObj<RoStringLiteral<L>, S>;
  unaryExpression?: VisitorObj<RoUnaryExpression<L>, S>;
}

export type PatternVisitor<L, S> = AnyPatternVisitor<L, S> | TypedPatternVisitor<L, S>;

export interface AnyPatternVisitor<L, S> {
  node?: undefined;
  pattern?: VisitorObj<RoPattern<L>, S>;
  identifierPattern?: undefined;
  memberPattern?: undefined;
  opRegisterPattern?: undefined;
  opTemporaryPattern?: undefined;
}

export interface TypedPatternVisitor<L, S> {
  node: undefined;
  pattern: undefined;
  identifierPattern?: VisitorObj<RoIdentifierPattern<L>, S>;
  memberPattern?: VisitorObj<RoMemberPattern<L>, S>;
  opRegisterPattern?: VisitorObj<RoOpRegisterPattern<L>, S>;
  opTemporaryPattern?: VisitorObj<RoOpTemporaryPattern<L>, S>;
}

export type VisitorFn<N extends RoNode, S> = (path: Path<N>, state: S) => VisitorAction | undefined;

export interface VisitorObj<N extends RoNode, S> {
  enter?: VisitorFn<N, S>;
  exit?: VisitorFn<N, S>;
}

export interface ResolvedVisitor<L, S> {
  enter: SimpleVisitor<L, S>;
  exit: SimpleVisitor<L, S>;
}

export interface SimpleVisitor<L, S> {
  script?: VisitorFn<RoScript<L>, S>;
  // Statements
  blockStatement?: VisitorFn<RoBlockStatement<L>, S>;
  emptyStatement?: VisitorFn<RoEmptyStatement<L>, S>;
  expressionStatement?: VisitorFn<RoExpressionStatement<L>, S>;
  ifFrameLoadedStatement?: VisitorFn<RoIfFrameLoadedStatement<L>, S>;
  ifStatement?: VisitorFn<RoIfStatement<L>, S>;
  opCallFunction?: VisitorFn<RoOpCallFunction<L>, S>;
  opConstantPool?: VisitorFn<RoOpConstantPool<L>, S>;
  opDeclareVariable?: VisitorFn<RoOpDeclareVariable<L>, S>;
  opEnumerate?: VisitorFn<RoOpEnumerate<L>, S>;
  opInitArray?: VisitorFn<RoOpInitArray<L>, S>;
  opInitObject?: VisitorFn<RoOpInitObject<L>, S>;
  opPush?: VisitorFn<RoOpPush<L>, S>;
  opTrace?: VisitorFn<RoOpTrace<L>, S>;
  returnStatement?: VisitorFn<RoReturnStatement<L>, S>;
  setVariable?: VisitorFn<RoSetVariable<L>, S>;
  throwStatement?: VisitorFn<RoThrowStatement<L>, S>;
  // Expressions
  assignmentExpression?: VisitorFn<RoAssignmentExpression<L>, S>;
  binaryExpression?: VisitorFn<RoBinaryExpression<L>, S>;
  booleanLiteral?: VisitorFn<RoBooleanLiteral<L>, S>;
  callExpression?: VisitorFn<RoCallExpression<L>, S>;
  conditionalExpression?: VisitorFn<RoConditionalExpression<L>, S>;
  identifier?: VisitorFn<RoIdentifier<L>, S>;
  logicalExpression?: VisitorFn<RoLogicalExpression<L>, S>;
  memberExpression?: VisitorFn<RoMemberExpression<L>, S>;
  newExpression?: VisitorFn<RoNewExpression<L>, S>;
  nullLiteral?: VisitorFn<RoNullLiteral<L>, S>;
  numberLiteral?: VisitorFn<RoNumberLiteral<L>, S>;
  opConstant?: VisitorFn<RoOpConstant<L>, S>;
  opGlobal?: VisitorFn<RoOpGlobal<L>, S>;
  opPop?: VisitorFn<RoOpPop<L>, S>;
  opPropertyName?: VisitorFn<RoOpPropertyName<L>, S>;
  opRegister?: VisitorFn<RoOpRegister<L>, S>;
  opTemporary?: VisitorFn<RoOpTemporary<L>, S>;
  opUndefined?: VisitorFn<RoOpUndefined<L>, S>;
  opVariable?: VisitorFn<RoOpVariable<L>, S>;
  sequenceExpression?: VisitorFn<RoSequenceExpression<L>, S>;
  stringLiteral?: VisitorFn<RoStringLiteral<L>, S>;
  unaryExpression?: VisitorFn<RoUnaryExpression<L>, S>;
  // Patterns
  identifierPattern?: VisitorFn<RoIdentifierPattern<L>, S>;
  memberPattern?: VisitorFn<RoMemberPattern<L>, S>;
  opRegisterPattern?: VisitorFn<RoOpRegisterPattern<L>, S>;
  opTemporaryPattern?: VisitorFn<RoOpTemporaryPattern<L>, S>;
}

export function resolveVisitor<L, S>(visitor: Visitor<L, S>): ResolvedVisitor<L, S> {
  const enter: SimpleVisitor<L, S> = {};
  const exit: SimpleVisitor<L, S> = {};

  if (visitor.node !== undefined) {
    const enterFn: VisitorFn<RoNode<L>, S> | undefined = visitor.node.enter;
    if (enterFn !== undefined) {
      enter.script = enterFn;
      enter.blockStatement = enterFn;
      enter.emptyStatement = enterFn;
      enter.expressionStatement = enterFn;
      enter.ifFrameLoadedStatement = enterFn;
      enter.ifStatement = enterFn;
      enter.opCallFunction = enterFn;
      enter.opConstantPool = enterFn;
      enter.opDeclareVariable = enterFn;
      enter.opEnumerate = enterFn;
      enter.opInitArray = enterFn;
      enter.opInitObject = enterFn;
      enter.opPush = enterFn;
      enter.opTrace = enterFn;
      enter.returnStatement = enterFn;
      enter.setVariable = enterFn;
      enter.throwStatement = enterFn;
    }
    const exitFn: VisitorFn<RoNode<L>, S> | undefined = visitor.node.exit;
    if (exitFn !== undefined) {
      exit.script = exitFn;
      exit.blockStatement = exitFn;
      exit.emptyStatement = exitFn;
      exit.expressionStatement = exitFn;
      exit.ifFrameLoadedStatement = exitFn;
      exit.ifStatement = exitFn;
      exit.opCallFunction = exitFn;
      exit.opConstantPool = exitFn;
      exit.opDeclareVariable = exitFn;
      exit.opEnumerate = exitFn;
      exit.opInitArray = exitFn;
      exit.opInitObject = exitFn;
      exit.opPush = exitFn;
      exit.opTrace = exitFn;
      exit.returnStatement = exitFn;
      exit.setVariable = exitFn;
      exit.throwStatement = exitFn;
    }
  } else {
    if (visitor.script !== undefined) {
      enter.script = visitor.script.enter;
      exit.script = visitor.script.exit;
    }
    if (visitor.statement !== undefined) {
      const enterFn: VisitorFn<RoStatement<L>, S> | undefined = visitor.statement.enter;
      if (enterFn !== undefined) {
        enter.blockStatement = enterFn;
        enter.emptyStatement = enterFn;
        enter.expressionStatement = enterFn;
        enter.ifFrameLoadedStatement = enterFn;
        enter.ifStatement = enterFn;
        enter.opCallFunction = enterFn;
        enter.opConstantPool = enterFn;
        enter.opDeclareVariable = enterFn;
        enter.opEnumerate = enterFn;
        enter.opInitArray = enterFn;
        enter.opInitObject = enterFn;
        enter.opPush = enterFn;
        enter.opTrace = enterFn;
        enter.returnStatement = enterFn;
        enter.setVariable = enterFn;
        enter.throwStatement = enterFn;
      }
      const exitFn: VisitorFn<RoStatement<L>, S> | undefined = visitor.statement.exit;
      if (exitFn !== undefined) {
        exit.blockStatement = exitFn;
        exit.emptyStatement = exitFn;
        exit.expressionStatement = exitFn;
        exit.ifFrameLoadedStatement = exitFn;
        exit.ifStatement = exitFn;
        exit.opCallFunction = exitFn;
        exit.opConstantPool = exitFn;
        exit.opDeclareVariable = exitFn;
        exit.opEnumerate = exitFn;
        exit.opInitArray = exitFn;
        exit.opInitObject = exitFn;
        exit.opPush = exitFn;
        exit.opTrace = exitFn;
        exit.returnStatement = exitFn;
        exit.setVariable = exitFn;
        exit.throwStatement = exitFn;
      }
    } else {
      throw new Error("NotImplemented");
    }
    if (visitor.expression !== undefined) {
      const enterFn: VisitorFn<RoExpression<L>, S> | undefined = visitor.expression.enter;
      if (enterFn !== undefined) {
        enter.assignmentExpression = enterFn;
        enter.binaryExpression = enterFn;
        enter.booleanLiteral = enterFn;
        enter.callExpression = enterFn;
        enter.conditionalExpression = enterFn;
        enter.identifier = enterFn;
        enter.logicalExpression = enterFn;
        enter.memberExpression = enterFn;
        enter.newExpression = enterFn;
        enter.nullLiteral = enterFn;
        enter.numberLiteral = enterFn;
        enter.opConstant = enterFn;
        enter.opGlobal = enterFn;
        enter.opPop = enterFn;
        enter.opPropertyName = enterFn;
        enter.opRegister = enterFn;
        enter.opTemporary = enterFn;
        enter.opUndefined = enterFn;
        enter.opVariable = enterFn;
        enter.sequenceExpression = enterFn;
        enter.stringLiteral = enterFn;
        enter.unaryExpression = enterFn;
      }
      const exitFn: VisitorFn<RoExpression<L>, S> | undefined = visitor.expression.exit;
      if (exitFn !== undefined) {
        exit.assignmentExpression = exitFn;
        exit.binaryExpression = exitFn;
        exit.booleanLiteral = exitFn;
        exit.callExpression = exitFn;
        exit.conditionalExpression = exitFn;
        exit.identifier = exitFn;
        exit.logicalExpression = exitFn;
        exit.memberExpression = exitFn;
        exit.newExpression = exitFn;
        exit.nullLiteral = exitFn;
        exit.numberLiteral = exitFn;
        exit.opConstant = exitFn;
        exit.opGlobal = exitFn;
        exit.opPop = exitFn;
        exit.opPropertyName = exitFn;
        exit.opRegister = exitFn;
        exit.opTemporary = exitFn;
        exit.opUndefined = exitFn;
        exit.opVariable = exitFn;
        exit.sequenceExpression = exitFn;
        exit.stringLiteral = exitFn;
        exit.unaryExpression = exitFn;
      }
    } else {
      throw new Error("NotImplemented");
    }
    if (visitor.pattern !== undefined) {
      const enterFn: VisitorFn<RoPattern<L>, S> | undefined = visitor.pattern.enter;
      if (enterFn !== undefined) {
        enter.identifierPattern = enterFn;
        enter.memberPattern = enterFn;
        enter.opRegisterPattern = enterFn;
        enter.opTemporaryPattern = enterFn;
      }
      const exitFn: VisitorFn<RoPattern<L>, S> | undefined = visitor.pattern.exit;
      if (exitFn !== undefined) {
        exit.identifierPattern = exitFn;
        exit.memberPattern = exitFn;
        exit.opRegisterPattern = exitFn;
        exit.opTemporaryPattern = exitFn;
      }
    } else {
      throw new Error("NotImplemented");
    }
  }

  return {enter, exit};
}
