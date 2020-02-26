import { Expression, RoExpression } from "./expression";
import { Pattern, RoPattern } from "./pattern";
import { RoScript, Script } from "./script";
import { RoStatement, Statement } from "./statement";

export type Node<L = unknown> = Script<L> | Statement<L> | Expression<L> | Pattern<L>;

export type RoNode<L = unknown> = RoScript<L> | RoStatement<L> | RoExpression<L> | RoPattern<L>;
