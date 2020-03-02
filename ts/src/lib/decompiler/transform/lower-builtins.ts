import { Expression, RoExpression } from "../../as2-types/expression";
import { CallExpression } from "../../as2-types/expressions/call-expression";
import { Identifier } from "../../as2-types/expressions/identifier";
import { RoNode } from "../../as2-types/node";
import { RoOpGlobal } from "../../as2-types/op-expressions/op-global";
import { RoOpTrace } from "../../as2-types/op-statements/op-trace";
import { ExpressionStatement } from "../../as2-types/statements/expression-statement";
import { OpGlobalPath, OpTracePath, Path } from "../traverse/path";
import { VisitorAction } from "../traverse/visitor";

export interface LowerBuiltinsOptions {
  global?: string;
  trace?: string;
}

export interface ResolvedBuiltins {
  global: string;
  trace: string;
}

/**
 * Replaces builtins by the provided regular identifiers
 */
export function lowerBuiltins(path: Path<RoNode<null>>, options?: LowerBuiltinsOptions): void {
  const resolved: ResolvedBuiltins = {
    global: options?.global ?? "_global",
    trace: options?.trace ?? "trace",
  };
  for (const opGlobal of findGlobals(path)) {
    const id: Identifier<null> = {
      type: "Identifier",
      loc: null,
      name: resolved.global,
    };
    opGlobal.replaceWith(id);
  }
  for (const opTrace of findTraces(path)) {
    const roValue: RoExpression<null> = opTrace.node().value;
    // TODO: Find a nicer way to perform substitution extracting sub-terms.
    const value: Expression<null> = roValue as Expression<null>;
    const id: Identifier<null> = {
      type: "Identifier",
      loc: null,
      name: resolved.trace,
    };
    const traceCall: CallExpression<null> = {
      type: "CallExpression",
      loc: null,
      callee: id,
      arguments: [value],
    };
    const traceStmt: ExpressionStatement<null> = {
      type: "ExpressionStatement",
      loc: null,
      expression: traceCall,
    };
    opTrace.replaceWith(traceStmt);
  }
}

function findGlobals(path: Path<RoNode<null>>): Set<OpGlobalPath<RoOpGlobal<null>>> {
  return path.traverse(
    {
      opGlobal: {
        enter(path: OpGlobalPath<RoOpGlobal<null>>, state: Set<OpGlobalPath<RoOpGlobal<null>>>): VisitorAction {
          state.add(path);
          return VisitorAction.Advance;
        },
      },
    },
    new Set(),
  );
}

function findTraces(path: Path<RoNode<null>>): Set<OpTracePath<RoOpTrace<null>>> {
  return path.traverse(
    {
      opTrace: {
        enter(path: OpTracePath<RoOpTrace<null>>, state: Set<OpTracePath<RoOpTrace<null>>>): VisitorAction {
          state.add(path);
          return VisitorAction.Advance;
        },
      },
    },
    new Set(),
  );
}
