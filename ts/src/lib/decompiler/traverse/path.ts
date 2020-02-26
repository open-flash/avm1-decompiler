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
import { RoOpCallFunction } from "../../as2-types/op-statements/op-call-function";
import { RoOpConstantPool } from "../../as2-types/op-statements/op-constant-pool";
import { RoOpDeclareVariable } from "../../as2-types/op-statements/op-declare-variable";
import { RoOpEnumerate } from "../../as2-types/op-statements/op-enumerate";
import { RoOpInitArray } from "../../as2-types/op-statements/op-init-array";
import { RoOpInitObject } from "../../as2-types/op-statements/op-init-object";
import { RoOpPush } from "../../as2-types/op-statements/op-push";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { RoScript } from "../../as2-types/script";
import { Statement } from "../../as2-types/statement";
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
import { RoIdentifierPattern } from "../../as2-types/patterns/identifier-pattern";
import { RoMemberPattern } from "../../as2-types/patterns/member-pattern";
import { RoOpRegisterPattern } from "../../as2-types/op-patterns/op-register-pattern";
import { RoOpTemporaryPattern } from "../../as2-types/op-patterns/op-temporary-pattern";

// tslint:disable:max-classes-per-file

export type Path<N extends RoNode = RoNode> =
  N extends RoScript ? ScriptPath<N> :
  N extends RoBlockStatement ? BlockStatementPath<N> :
  N extends RoEmptyStatement ? EmptyStatementPath<N> :
  N extends RoExpressionStatement ? ExpressionStatementPath<N> :
  N extends RoIfFrameLoadedStatement ? IfFrameLoadedStatementPath<N> :
  N extends RoIfStatement ? IfStatementPath<N> :
  N extends RoOpCallFunction ? OpCallFunctionPath<N> :
  N extends RoOpConstantPool ? OpConstantPoolPath<N> :
  N extends RoOpDeclareVariable ? OpDeclareVariablePath<N> :
  N extends RoOpEnumerate ? OpEnumeratePath<N> :
  N extends RoOpInitArray ? OpInitArrayPath<N> :
  N extends RoOpInitObject ? OpInitObjectPath<N> :
  N extends RoOpPush ? OpPushPath<N> :
  N extends RoOpTrace ? OpTracePath<N> :
  AbstractPath<N>;

abstract class AbstractPath<N extends RoNode> {
  private readonly _tree: Tree<N["loc"]>;
  private readonly _node: N;

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

  replaceWith(statement: Statement<N["loc"]>) {
    this._tree.replaceWith(this._node, statement);
  }

  abstract visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined;
}

export class ScriptPath<N extends RoScript = RoScript> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.script?.(this, state);
  }
}

export class BlockStatementPath<N extends RoBlockStatement = RoBlockStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.blockStatement?.(this, state);
  }
}

export class EmptyStatementPath<N extends RoEmptyStatement = RoEmptyStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.emptyStatement?.(this, state);
  }
}

export class ExpressionStatementPath<N extends RoExpressionStatement = RoExpressionStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.expressionStatement?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class IfFrameLoadedStatementPath<N extends RoIfFrameLoadedStatement = RoIfFrameLoadedStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.ifFrameLoadedStatement?.(this, state);
  }
}

export class IfStatementPath<N extends RoIfStatement = RoIfStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.ifStatement?.(this, state);
  }
}

export class OpCallFunctionPath<N extends RoOpCallFunction = RoOpCallFunction> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opCallFunction?.(this, state);
  }
}

export class OpConstantPoolPath<N extends RoOpConstantPool = RoOpConstantPool> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opConstantPool?.(this, state);
  }
}

export class OpDeclareVariablePath<N extends RoOpDeclareVariable = RoOpDeclareVariable> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opDeclareVariable?.(this, state);
  }
}

export class OpEnumeratePath<N extends RoOpEnumerate = RoOpEnumerate> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opEnumerate?.(this, state);
  }
}

export class OpInitArrayPath<N extends RoOpInitArray = RoOpInitArray> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opInitArray?.(this, state);
  }
}

export class OpInitObjectPath<N extends RoOpInitObject = RoOpInitObject> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opInitObject?.(this, state);
  }
}

export class OpPushPath<N extends RoOpPush = RoOpPush> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPush?.(this, state);
  }
}

export class OpTracePath<N extends RoOpTrace = RoOpTrace> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opTrace?.(this, state);
  }
}

export class ReturnStatementPath<N extends RoReturnStatement = RoReturnStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.returnStatement?.(this, state);
  }
}

export class SetVariablePath<N extends RoSetVariable = RoSetVariable> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.setVariable?.(this, state);
  }
}

export class ThrowStatementPath<N extends RoThrowStatement = RoThrowStatement> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.throwStatement?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class AssignmentExpressionPath<N extends RoAssignmentExpression = RoAssignmentExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.assignmentExpression?.(this, state);
  }
}

export class BinaryExpressionPath<N extends RoBinaryExpression = RoBinaryExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.binaryExpression?.(this, state);
  }
}

export class BooleanLiteralPath<N extends RoBooleanLiteral = RoBooleanLiteral> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.booleanLiteral?.(this, state);
  }
}

export class CallExpressionPath<N extends RoCallExpression = RoCallExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.callExpression?.(this, state);
  }
}

// tslint:disable-next-line:max-line-length
export class ConditionalExpressionPath<N extends RoConditionalExpression = RoConditionalExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.conditionalExpression?.(this, state);
  }
}

export class IdentifierPath<N extends RoIdentifier = RoIdentifier> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.identifier?.(this, state);
  }
}

export class LogicalExpressionPath<N extends RoLogicalExpression = RoLogicalExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.logicalExpression?.(this, state);
  }
}

export class MemberExpressionPath<N extends RoMemberExpression = RoMemberExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.memberExpression?.(this, state);
  }
}

export class NewExpressionPath<N extends RoNewExpression = RoNewExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.newExpression?.(this, state);
  }
}

export class NullLiteralPath<N extends RoNullLiteral = RoNullLiteral> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.nullLiteral?.(this, state);
  }
}

export class NumberLiteralPath<N extends RoNumberLiteral = RoNumberLiteral> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.numberLiteral?.(this, state);
  }
}

export class OpConstantPath<N extends RoOpConstant = RoOpConstant> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opConstant?.(this, state);
  }
}

export class OpGlobalPath<N extends RoOpGlobal = RoOpGlobal> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opGlobal?.(this, state);
  }
}

export class OpPopPath<N extends RoOpPop = RoOpPop> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPop?.(this, state);
  }
}

export class OpPropertyNamePath<N extends RoOpPropertyName = RoOpPropertyName> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opPropertyName?.(this, state);
  }
}

export class OpRegisterPath<N extends RoOpRegister = RoOpRegister> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opRegister?.(this, state);
  }
}

export class OpTemporaryPath<N extends RoOpTemporary = RoOpTemporary> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opTemporary?.(this, state);
  }
}

export class OpUndefinedPath<N extends RoOpUndefined = RoOpUndefined> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opUndefined?.(this, state);
  }
}

export class OpVariablePath<N extends RoOpVariable = RoOpVariable> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.opVariable?.(this, state);
  }
}

export class SequenceExpressionPath<N extends RoSequenceExpression = RoSequenceExpression> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.sequenceExpression?.(this, state);
  }
}

export class StringLiteralPath<N extends RoStringLiteral = RoStringLiteral> extends AbstractPath<N> {
  visit<S>(visitor: SimpleVisitor<N["loc"], S>, state: S): VisitorAction | undefined {
    return visitor.stringLiteral?.(this, state);
  }
}

export class UnaryExpressionPath<N extends RoUnaryExpression = RoUnaryExpression> extends AbstractPath<N> {
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
