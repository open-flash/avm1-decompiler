import { $Cfg, Cfg } from "avm1-types/cfg/cfg";
import * as chai from "chai";
import fs from "fs";
import { JsonReader } from "kryo/readers/json";
import sysPath from "path";
import { emitScript } from "../../lib/as2-emitter/emitter";
import { Script } from "../../lib/as2-types/script";
import { decompileCfg } from "../../lib/decompiler/decompile";
import { lowerBuiltins } from "../../lib/decompiler/transform/lower-builtins";
import { Tree } from "../../lib/decompiler/traverse";
import { Path } from "../../lib/decompiler/traverse/path";
import { VisitorAction } from "../../lib/decompiler/traverse/visitor";
import meta from "./meta.js";
import { readTextFile, writeTextFile } from "./utils";
import { eliminatePushPop } from "../../lib/decompiler/transform/push-pop-elimination";

const PROJECT_ROOT: string = sysPath.join(meta.dirname, "..", "..", "..", "..");
console.log(PROJECT_ROOT);
const REPO_ROOT: string = sysPath.join(PROJECT_ROOT, "..");
console.log(REPO_ROOT);
const AVM1_SAMPLES_ROOT: string = sysPath.join(REPO_ROOT, "tests", "avm1");

const JSON_READER: JsonReader = new JsonReader();
// `BLACKLIST` can be used to forcefully skip some tests.
const BLACKLIST: ReadonlySet<string> = new Set([]);
// `WHITELIST` can be used to only enable a few tests.
const WHITELIST: ReadonlySet<string> = new Set([
  // "avm1-bytes/constant-on-stack-definition",
  // "branches/switch-default",
]);

describe("avm1", function () {
  this.timeout(300000); // The timeout is this high due to CI being extremely slow

  for (const sample of getSamples()) {
    it(sample.name, async function () {
      const inputJson: string = await readTextFile(sample.cfgPath);
      const inputCfg: Cfg = $Cfg.read(JSON_READER, inputJson);

      const actualScript: Script<null> = decompileCfg(inputCfg);

      const actualScriptJson: string = `${JSON.stringify(actualScript, null, 2)}\n`;
      await writeTextFile(sysPath.join(sample.root, "local-main.ts.json"), actualScriptJson);

      const tree: Tree<null> = new Tree(actualScript);
      const nodeCount: {count: number} = tree.traverse(
        {
          node: {
            enter: (_path: Path, state: {count: number}): VisitorAction => {
              state.count += 1;
              return VisitorAction.Advance;
            },
          },
        },
        {count: 0},
      );
      chai.assert.isTrue(nodeCount.count > 0);

      lowerBuiltins(tree.path(tree.root));
      eliminatePushPop(tree);

      const actualSource: string = emitScript(actualScript);
      await writeTextFile(sysPath.join(sample.root, "local-main.ts.opas2"), actualSource);
    });
  }
});

interface Sample {
  root: string;
  name: string;
  cfgPath: string;
}

function* getSamples(): IterableIterator<Sample> {
  for (const dirEnt of fs.readdirSync(AVM1_SAMPLES_ROOT, {withFileTypes: true})) {
    if (!dirEnt.isDirectory() || dirEnt.name.startsWith(".")) {
      continue;
    }

    const groupName: string = dirEnt.name;
    const groupPath: string = sysPath.join(AVM1_SAMPLES_ROOT, groupName);

    for (const dirEnt of fs.readdirSync(groupPath, {withFileTypes: true})) {
      if (!dirEnt.isDirectory()) {
        continue;
      }
      const testName: string = dirEnt.name;
      const testPath: string = sysPath.join(groupPath, testName);

      const name: string = `${groupName}/${testName}`;

      if (BLACKLIST.has(name)) {
        continue;
      } else if (WHITELIST.size > 0 && !WHITELIST.has(name)) {
        continue;
      }

      const cfgPath: string = sysPath.join(testPath, "cfg.json");

      yield {root: testPath, name, cfgPath};
    }
  }
}
