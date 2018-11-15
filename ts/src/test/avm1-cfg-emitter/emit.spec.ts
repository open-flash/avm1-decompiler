import chai from "chai";
import fs from "fs";
import { emitDot } from "../../lib/avm1-cfg-emitter/emit";
import { buildCfgFromAvm1 } from "../../lib/cfg/builder";
import { Cfg } from "../../lib/cfg/cfg";
import { getFixtures } from "../fixtures";

describe("avm1CfgEmitter", () => {
  for (const fixture of getFixtures()) {
    it(fixture.name, async () => {
      const avm1Bytes: Buffer = await (fs as any).promises.readFile(fixture.avm1Path);
      const cfg: Cfg = buildCfgFromAvm1(avm1Bytes);
      const actual: string = emitDot(cfg);
      chai.assert.isTrue(actual.length > 0);
    });
  }
});
