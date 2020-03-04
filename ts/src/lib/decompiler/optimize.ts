// import { Expression } from "../as2-types/expression";
// import { Statement } from "../as2-types/statement";
// import { ScopeContext } from "./action";
//
// /**
//  * Eliminate `@push` operations by replacing them with temporary variables.
//  *
//  * Example:
//  *
//  * ```
//  * // Input
//  * @push(2);
//  * @trace("foo");
//  * @trace(@pop());
//  *
//  * // Output:
//  * @t0 = 2;
//  * @trace("foo");
//  * @trace(@t0);
//  * ```
//  *
//  * A `@push` is eliminated only if it is matched with a `@pop`.
//  */
// export function matchPush(scope: ScopeContext, statements: Statement[]): void {
//   // Index of the active push statements
//   const pushStatements: number[] = [];
//   for (const [i, statement] of statements.entries()) {
//     switch (statement.type) {
//       case "EmptyStatement":
//         break;
//       case "OpPush":
//         pushStatements.push(i);
//         break;
//       default:
//         throw new Error("Unexpected");
//     }
//   }
// }
//
// /**
//  * Checks if the provided statement uses the AVM stack.
//  * Any operation that pushes or pops values counts as a use.
//  */
// function isStatementUsingStack(statement: Statement<unknown>): boolean {
//   switch (statement.type) {
//     case "OpEnumerate":
//     case "OpPush":
//       return true;
//     case "EmptyStatement":
//       return false;
//     case "BlockStatement":
//       return statement.body.some(isStatementUsingStack);
//     case "ExpressionStatement":
//       return isExpressionUsingStack(statement.expression);
//     default:
//       throw new Error("NotImplemented");
//   }
// }
//
// function isExpressionUsingStack(expression: Expression<unknown>): boolean {
//   switch (expression.type) {
//     case "OpStackCall":
//     case "OpInitArray":
//     case "OpInitObject":
//     case "OpPop":
//       return true;
//     case "OpConstant":
//     case "OpGlobal":
//     case "OpPropertyName":
//     case "OpRegister":
//     case "OpTemporary":
//     case "OpUndefined":
//     case "OpVariable":
//       return false;
//     default:
//       throw new Error("NotImplemented");
//   }
// }
