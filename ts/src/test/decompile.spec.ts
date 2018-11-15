import chai from "chai";
import fs from "fs";
import { emitDot, emitSvg } from "../lib/avm1-cfg-emitter/emit";
import { Cfg } from "../lib/cfg/cfg";
import { disassemble } from "../lib/disassemble";
import { getFixtures } from "./fixtures";

describe("disassemble", () => {
  for (const fixture of getFixtures()) {
    it(fixture.name, async () => {
      const avm1Bytes: Buffer = await (fs as any).promises.readFile(fixture.avm1Path);
      const cfg: Cfg = disassemble(avm1Bytes);

      const dotOutput: string = emitDot(cfg);
      const dotPath: string = `${fixture.avm1Path}.dot`;
      (fs as any).promises.writeFile(dotPath, dotOutput);
      const svgOutput: string = await emitSvg(cfg);
      const svgPath: string = `${fixture.avm1Path}.svg`;
      (fs as any).promises.writeFile(svgPath, svgOutput);

      chai.assert.isTrue(avm1Bytes !== null);
    });
  }
});
