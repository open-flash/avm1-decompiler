import { Expression, RoExpression } from "../../as2-types/expression";
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
import { RoOpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { RoOpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { RoOpEnumerate } from "../../as2-types/op-statements/op-enumerate";
import { RoOpInitArray } from "../../as2-types/op-statements/op-init-array";
import { RoOpInitObject } from "../../as2-types/op-statements/op-init-object";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { RoOpStackCall } from "../../as2-types/op-statements/op-stack-call";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { RoIdentifierPattern } from "../../as2-types/patterns/identifier-pattern";
import { RoMemberPattern } from "../../as2-types/patterns/member-pattern";
import { RoScript } from "../../as2-types/script";
import { RoStatement, Statement } from "../../as2-types/statement";
import { RoBlockStatement } from "../../as2-types/statements/block-statement";
import { RoEmptyStatement } from "../../as2-types/statements/empty-statement";
import { RoExpressionStatement } from "../../as2-types/statements/expression-statement";
import { RoIfFrameLoadedStatement } from "../../as2-types/statements/if-frame-loaded-statement";
import { RoIfStatement } from "../../as2-types/statements/if-statement";
import { RoReturnStatement } from "../../as2-types/statements/return-statement";
import { RoSetVariable } from "../../as2-types/statements/set-variable";
import { RoThrowStatement } from "../../as2-types/statements/throw-statement";
import { Tree } from "../traverse";
import { SimpleVisitor, Visitor, VisitorAction } from "./visitor";

// tslint:disable:max-classes-per-file cyclomatic-complexity

export type Path<N extends RoNode = RoNode> =
  N extends RoScript ? ScriptPath<N> :
  N extends RoBlockStatement ? BlockStatementPath<N> :
  N extends RoEmptyStatement ? EmptyStatementPath<N> :
  N extends RoExpressionStatement ? ExpressionStatementPath<N> :
  N extends RoIfFrameLoadedStatement ? IfFrameLoadedStatementPath<N> :
  N extends RoIfStatement ? IfStatementPath<N> :
  N extends RoOpStackCall ? OpStackCallPath<N> :
  N extends RoOpConstantPool ? OpConstantPoolPath<N> :
  N extends RoOpDeclareVariable ? OpDeclareVariablePath<N> :
  N extends RoOpEnumerate ? OpEnumeratePath<N> :
  N extends RoOpInitArray ? OpInitArrayPath<N> :
  N extends RoOpInitObject ? OpInitObjectPath<N> :
  N extends RoOpPush ? OpPushPath<N> :
  N extends RoOpTrace ? OpTracePath<N> :
  N extends RoAssignmentExpression ? AssignmentExpressionPath<N> :
  N extends RoBinaryExpression ? BinaryExpressionPath<N> :
  N extends RoBooleanLiteral ? BooleanLiteralPath<N> :
  N extends RoCallExpression ? CallExpressionPath<N> :
  N extends RoConditionalExpression ? ConditionalExpressionPath<N> :
  N extends RoIdentifier ? IdentifierPath<N> :
  N extends RoLogicalExpression ? LogicalExpressionPath<N> :
  N extends RoMemberExpression ? MemberExpressionPath<N> :
  N extends RoNewExpression ? NewExpressionPath<N> :
  N extends RoNullLiteral ? NullLiteralPath<N> :
  N extends RoNumberLiteral ? NumberLiteralPath<N> :
  N extends RoOpConstant ? OpConstantPath<N> :
  N extends RoOpGlobal ? OpGlobalPath<N> :
  N extends RoOpPop ? OpPopPath<N> :
  N extends RoOpPropertyName ? OpPropertyNamePath<N> :
  N extends RoOpRegister ? OpRegisterPath<N> :
  N extends RoOpTemporary ? OpTemporaryPath<N> :
  N extends RoOpUndefined ? OpUndefinedPath<N> :
  N extends RoOpVariable ? OpVariablePath<N> :
  N extends RoSequenceExpression ? SequenceExpressionPath<N> :
  N extends RoStringLiteral ? StringLiteralPath<N> :
  N extends RoUnaryExpression ? UnaryExpressionPath<N> :
  N extends RoExpression ? AbstractExpressionPath<N> :
  AbstractPath<N>;

export namespace Path {
  export function create<N extends RoNode = RoNode>(tree: Tree<N["loc"]>, node: N): Path<N> {
    switch (node.type) {
      case "Script": return new ScriptPath(tree, node as any) as any;
      case "BlockStatement": return new BlockStatementPath(tree, node as any) as any;
      case "EmptyStatement": return new EmptyStatementPath(tree, node as any) as any;
      case "ExpressionStatement": return new ExpressionStatementPath(tree, node as any) as any;
      case "IfFrameLoadedStatement": return new IfFrameLoadedStatementPath(tree, node as any) as any;
      case "IfStatement": return new IfStatementPath(tree, node as any) as any;
      case "OpConstantPool": return new OpConstantPoolPath(tree, node as any) as any;
      case "OpDeclareVariable": return new OpDeclareVariablePath(tree, node as any) as any;
      case "OpEnumerate": return new OpEnumeratePath(tree, node as any) as any;
      case "OpInitArray": return new OpInitArrayPath(tree, node as any) as any;
      case "OpInitObject": return new OpInitObjectPath(tree, node as any) as any;
      case "OpPush": return new OpPushPath(tree, node as any) as any;
      case "OpStackCall": return new OpStackCallPath(tree, node as any) as any;
      case "OpTrace": return new OpTracePath(tree, node as any) as any;
      case "AssignmentExpression": return new AssignmentExpressionPath(tree, node as any) as any;
      case "BinaryExpression": return new BinaryExpressionPath(tree, node as any) as any;
      case "BooleanLiteral": return new BooleanLiteralPath(tree, node as any) as any;
      case "CallExpression": return new CallExpressionPath(tree, node as any) as any;
      case "ConditionalExpression": return new ConditionalExpressionPath(tree, node as any) as any;
      case "Identifier": return new IdentifierPath(tree, node as any) as any;
      case "LogicalExpression": return new LogicalExpressionPath(tree, node as any) as any;
      case "MemberExpression": return new MemberExpressionPath(tree, node as any) as any;
      case "NewExpression": return new NewExpressionPath(tree, node as any) as any;
      case "NullLiteral": return new NullLiteralPath(tree, node as any) as any;
      case "NumberLiteral": return new NumberLiteralPath(tree, node as any) as any;
      case "OpConstant": return new OpConstantPath(tree, node as any) as any;
      case "OpGlobal": return new OpGlobalPath(tree, node as any) as any;
      case "OpPop": return new OpPopPath(tree, node as any) as any;
      case "OpPropertyName": return new OpPropertyNamePath(tree, node as any) as any;
      case "OpRegister": return new OpRegisterPath(tree, node as any) as any;
      case "OpTemporary": return new OpTemporaryPath(tree, node as any) as any;
      case "OpUndefined": return new OpUndefinedPath(tree, node as any) as any;
      case "OpVariable": return new OpVariablePath(tree, node as any) as any;
      case "SequenceExpression": return new SequenceExpressionPath(tree, node as any) as any;
      case "StringLiteral": return new StringLiteralPath(tree, node as any) as any;
      case "UnaryExpression": return new UnaryExpressionPath(tree, node as any) as any;
      default:
        throw new Error("Unexpected node type");
    }
  }
}

abstract class AbstractPath<N extends RoNode> {
  protected readonly _tree: Tree<N["loc"]>;
  protected readonly _node: N;

  /**
   * @internal
   */
  constructor(tree: Tree<N["loc"]>, node: N) {
    this._tree = tree;
    this._node = node;
  }

  node(): N {
    return this._node;
  }

  traverse<S>(visitor: Visitor<N["loc"], S>, state: S): S {
    return this._tree.traverseFrom(this._node, visitor, state);
  }

  abstract visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined;
}

abstract class AbstractStatementPath<N extends RoStatement> extends AbstractPath<N> {
  replaceWith(stmt: Statement<N["loc"]>) {
    this._tree.replaceStatement(this._node, stmt);
  }
}

abstract class AbstractExpressionPath<N extends RoExpression> extends AbstractPath<N> {
  replaceWith(expr: Expression<N["loc"]>) {
    this._tree.replaceExpression(this._node, expr);
  }
}

export class ScriptPath<N extends RoScript = RoScript> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.script?.(this, state);
  }
}

export class BlockStatementPath<N extends RoBlockStatement = RoBlockStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.blockStatement?.(this, state);
  }
}

export class EmptyStatementPath<N extends RoEmptyStatement = RoEmptyStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.emptyStatement?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class ExpressionStatementPath<N extends RoExpressionStatement = RoExpressionStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.expressionStatement?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class IfFrameLoadedStatementPath<N extends RoIfFrameLoadedStatement = RoIfFrameLoadedStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.ifFrameLoadedStatement?.(this, state);
  }
}

export class IfStatementPath<N extends RoIfStatement = RoIfStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.ifStatement?.(this, state);
  }
}

export class OpConstantPoolPath<N extends RoOpConstantPool = RoOpConstantPool> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opConstantPool?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class OpDeclareVariablePath<N extends RoOpDeclareVariable = RoOpDeclareVariable> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opDeclareVariable?.(this, state);
  }
}

export class OpEnumeratePath<N extends RoOpEnumerate = RoOpEnumerate> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opEnumerate?.(this, state);
  }
}

export class OpInitArrayPath<N extends RoOpInitArray = RoOpInitArray> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opInitArray?.(this, state);
  }
}

export class OpInitObjectPath<N extends RoOpInitObject = RoOpInitObject> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opInitObject?.(this, state);
  }
}

export class OpPushPath<N extends RoOpPush = RoOpPush> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPush?.(this, state);
  }
}

export class OpStackCallPath<N extends RoOpStackCall = RoOpStackCall> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opStackCall?.(this, state);
  }
}

export class OpTracePath<N extends RoOpTrace = RoOpTrace> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opTrace?.(this, state);
  }
}

export class ReturnStatementPath<N extends RoReturnStatement = RoReturnStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.returnStatement?.(this, state);
  }
}

export class SetVariablePath<N extends RoSetVariable = RoSetVariable> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.setVariable?.(this, state);
  }
}

export class ThrowStatementPath<N extends RoThrowStatement = RoThrowStatement> extends AbstractStatementPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.throwStatement?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class AssignmentExpressionPath<N extends RoAssignmentExpression = RoAssignmentExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.assignmentExpression?.(this, state);
  }
}

export class BinaryExpressionPath<N extends RoBinaryExpression = RoBinaryExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.binaryExpression?.(this, state);
  }
}

export class BooleanLiteralPath<N extends RoBooleanLiteral = RoBooleanLiteral> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.booleanLiteral?.(this, state);
  }
}

export class CallExpressionPath<N extends RoCallExpression = RoCallExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.callExpression?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class ConditionalExpressionPath<N extends RoConditionalExpression = RoConditionalExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.conditionalExpression?.(this, state);
  }
}

export class IdentifierPath<N extends RoIdentifier = RoIdentifier> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.identifier?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class LogicalExpressionPath<N extends RoLogicalExpression = RoLogicalExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.logicalExpression?.(this, state);
  }
}

export class MemberExpressionPath<N extends RoMemberExpression = RoMemberExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.memberExpression?.(this, state);
  }
}

export class NewExpressionPath<N extends RoNewExpression = RoNewExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.newExpression?.(this, state);
  }
}

export class NullLiteralPath<N extends RoNullLiteral = RoNullLiteral> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.nullLiteral?.(this, state);
  }
}

export class NumberLiteralPath<N extends RoNumberLiteral = RoNumberLiteral> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.numberLiteral?.(this, state);
  }
}

export class OpConstantPath<N extends RoOpConstant = RoOpConstant> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opConstant?.(this, state);
  }
}

export class OpGlobalPath<N extends RoOpGlobal = RoOpGlobal> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opGlobal?.(this, state);
  }
}

export class OpPopPath<N extends RoOpPop = RoOpPop> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPop?.(this, state);
  }
}

export class OpPropertyNamePath<N extends RoOpPropertyName = RoOpPropertyName> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPropertyName?.(this, state);
  }
}

export class OpRegisterPath<N extends RoOpRegister = RoOpRegister> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opRegister?.(this, state);
  }
}

export class OpTemporaryPath<N extends RoOpTemporary = RoOpTemporary> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opTemporary?.(this, state);
  }
}

export class OpUndefinedPath<N extends RoOpUndefined = RoOpUndefined> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opUndefined?.(this, state);
  }
}

export class OpVariablePath<N extends RoOpVariable = RoOpVariable> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opVariable?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class SequenceExpressionPath<N extends RoSequenceExpression = RoSequenceExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.sequenceExpression?.(this, state);
  }
}

export class StringLiteralPath<N extends RoStringLiteral = RoStringLiteral> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.stringLiteral?.(this, state);
  }
}

export class UnaryExpressionPath<N extends RoUnaryExpression = RoUnaryExpression> extends AbstractExpressionPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.unaryExpression?.(this, state);
  }
}

export class IdentifierPatternPath<N extends RoIdentifierPattern = RoIdentifierPattern> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.identifierPattern?.(this, state);
  }
}

export class MemberPatternPath<N extends RoMemberPattern = RoMemberPattern> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.memberPattern?.(this, state);
  }
}

export class OpRegisterPatternPath<N extends RoOpRegisterPattern = RoOpRegisterPattern> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opRegisterPattern?.(this, state);
  }
}

export class OpTemporaryPatternPath<N extends RoOpTemporaryPattern = RoOpTemporaryPattern> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opTemporaryPattern?.(this, state);
  }
}
