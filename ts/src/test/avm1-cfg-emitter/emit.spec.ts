import chai from "chai";
import fs from "fs";
import { emitDot } from "../../lib/avm1-cfg-emitter/emit";
import { Cfg } from "../../lib/cfg";
import { getFixtures } from "../fixtures";

describe("avm1CfgEmitter", () => {
  for (const fixture of getFixtures()) {
    it(fixture.name, async () => {
      const avm1Bytes: Buffer = await (fs as any).promises.readFile(fixture.avm1Path);
      const cfg: Cfg = Cfg.fromAvm1(avm1Bytes);
      const actual: string = emitDot(cfg);
      chai.assert.isTrue(actual.length > 0);
    });
  }
});
