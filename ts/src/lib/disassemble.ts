import { buildCfgFromAvm1 } from "./cfg/builder";
import { Cfg } from "./cfg/cfg";
import { reduceConstantPool } from "./disassembler/constant-pool";
import { expressionize } from "./disassembler/expressionize";
import { reduceChains } from "./disassembler/reduce-chains";
import { reduceConditionals } from "./disassembler/reduce-conditionals";

export function disassemble(avm1: Uint8Array): any {
  const cfg: Cfg = buildCfgFromAvm1(avm1);
  reduceConstantPool(cfg, false);
  expressionize(cfg);
  reduceChains(cfg);
  reduceConditionals(cfg);
  return cfg;
}
