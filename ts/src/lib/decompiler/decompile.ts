import { Action } from "avm1-types/cfg/action";
import { Cfg } from "avm1-types/cfg/cfg";
import { CfgBlock } from "avm1-types/cfg/cfg-block";
import { CfgFlowType } from "avm1-types/cfg/cfg-flow-type";
import { Script } from "../as2-types/script";
import { Statement } from "../as2-types/statement";
import { decompileAction, OpAs2Emitter, ScopeContext } from "./action";

export function decompileCfg(cfg: Cfg): Script {
  if (cfg.blocks.length !== 1) {
    throw new Error("NotImplemented: Support for multiple blocks");
  }
  const block: CfgBlock = cfg.blocks[0];
  if (block.flow.type !== CfgFlowType.Simple || block.flow.next !== null) {
    throw new Error("NotImplemented: Support for control flow actions");
  }
  const cx: ScopeContext = new ScopeContext();
  const body: Statement[] = decompileActions(cx, block.actions);
  return {type: "Script", loc: null, body};
}

function decompileActions(cx: ScopeContext, actions: readonly Action[]): Statement[] {
  const body: Statement[] = [];
  for (const action of actions) {
    const actionCx: OpAs2Emitter = new OpAs2Emitter<null>(cx, null, body);
    decompileAction(actionCx, action);
  }
  return body;
}
