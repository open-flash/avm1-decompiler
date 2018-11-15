import { buildCfgFromAvm1 } from "./cfg/builder";
import { Cfg } from "./cfg/cfg";
import { reduceConstantPool } from "./constant-pool";
import { expressionize } from "./expressionize";
import { reduceChains } from "./reduce-chains";

export function disassemble(avm1: Uint8Array): any {
  const cfg: Cfg = buildCfgFromAvm1(avm1);
  reduceConstantPool(cfg, false);
  expressionize(cfg);
  reduceChains(cfg);
  return cfg;
}
