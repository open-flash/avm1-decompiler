import { ExpressionStatement } from "./statements/expression-statement";
import { IfFrameLoadedStatement } from "./statements/if-frame-loaded-statement";
import { IfStatement } from "./statements/if-statement";

export type Statement<L = null> = ExpressionStatement<L> | IfFrameLoadedStatement<L> | IfStatement;
