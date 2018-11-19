import chai from "chai";
import {
  BuilderNode,
  BuilderSimpleNode,
  CfgBuilder,
  createSimpleNode,
  IncompleteSimpleNode,
} from "../../lib/cfg/builder";
import { Cfg, Traversal } from "../../lib/cfg/cfg";
import { EndNode, SimpleNode } from "../../lib/cfg/node";

describe("Cfg", () => {
  describe("#iterNodes", () => {
    const builder: CfgBuilder = new CfgBuilder();
    const a: BuilderSimpleNode = builder.getSource();
    const [c, d] = builder.appendIf(a as IncompleteSimpleNode);
    const b: BuilderNode = a.out!.to;
    const e: IncompleteSimpleNode = createSimpleNode();
    builder.addSimpleEdge(c, e);
    builder.addSimpleEdge(d, e);
    const f: EndNode = builder.appendEnd(e);
    const cfg: Cfg = new Cfg(a as SimpleNode);
    //              -> false(c)
    //             /           \
    //  #a -> if#b              -> e -> end#f
    //             \           /
    //              -> true(d)

    const preorderDfs: ReadonlyArray<BuilderNode> = [a, b, c, e, f, d];
    const postorderDfs: ReadonlyArray<BuilderNode> = [f, e, d, c, b, a];
    const reverserPostorderDfs: ReadonlyArray<BuilderNode> = [a, b, c, d, e, f];

    it("Traversal.PreorderDfs", () => {
      const actual: ReadonlyArray<BuilderNode> = [...cfg.iterNodes(Traversal.PreorderDfs)];
      for (const [i, expected] of preorderDfs.entries()) {
        chai.assert.strictEqual(actual[i], expected, `Index ${i}`);
      }
    });

    it("Traversal.PostorderDfs", () => {
      const actual: ReadonlyArray<BuilderNode> = [...cfg.iterNodes(Traversal.PostorderDfs)];
      for (const [i, expected] of postorderDfs.entries()) {
        chai.assert.strictEqual(actual[i], expected, `Index ${i}`);
      }
    });

    it("Traversal.ReversePostorderDfs", () => {
      const actual: ReadonlyArray<BuilderNode> = [...cfg.iterNodes(Traversal.ReversePostorderDfs)];
      for (const [i, expected] of reverserPostorderDfs.entries()) {
        chai.assert.strictEqual(actual[i], expected, `Index ${i}`);
      }
    });
  });
});
