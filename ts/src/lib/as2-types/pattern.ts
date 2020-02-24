import { OpRegisterPattern } from "./op-patterns/op-register-pattern";
import { OpTemporaryPattern } from "./op-patterns/op-temporary-pattern";
import { IdentifierPattern } from "./patterns/identifier-pattern";
import { MemberPattern } from "./patterns/member-pattern";

/**
 * Expressions correspond to nodes able to representation the target of an assignment.
 */
export type Pattern<L = null> =
  IdentifierPattern<L>
  | MemberPattern<L>
  | OpRegisterPattern<L>
  | OpTemporaryPattern<L>;
