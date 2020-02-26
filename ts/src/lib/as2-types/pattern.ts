import { OpRegisterPattern, RoOpRegisterPattern } from "./op-patterns/op-register-pattern";
import { OpTemporaryPattern, RoOpTemporaryPattern } from "./op-patterns/op-temporary-pattern";
import { IdentifierPattern, RoIdentifierPattern } from "./patterns/identifier-pattern";
import { MemberPattern, RoMemberPattern } from "./patterns/member-pattern";

/**
 * Expressions correspond to nodes able to representation the target of an assignment.
 */
export type Pattern<L = unknown> =
  IdentifierPattern<L>
  | MemberPattern<L>
  | OpRegisterPattern<L>
  | OpTemporaryPattern<L>;

export type RoPattern<L = unknown> =
  RoIdentifierPattern<L>
  | RoMemberPattern<L>
  | RoOpRegisterPattern<L>
  | RoOpTemporaryPattern<L>;
