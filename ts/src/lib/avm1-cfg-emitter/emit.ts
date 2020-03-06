import cp from "child_process";
import { emitExpression } from "../as2-emitter/emitter";
import { emitAction } from "../avm1-asm-emitter/action";
import { Cfg } from "../cfg/cfg";
import { ConditionalEdge, Edge, EdgeType, SubCfgEdge } from "../cfg/edge";
import { Node, NodeType } from "../cfg/node";
import { CP_STATE_ANY, CP_STATE_UNINITIALIZED } from "../disassembler/constant-pool";
import { PartialExpr } from "../partial-expr";
import { UintIterator } from "../uint-iterator";

// tslint:disable:no-use-before-declare

export async function emitSvg(cfg: Cfg): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const dot: string = emitDot(cfg);
    const proc: cp.ChildProcessWithoutNullStreams = cp.spawn("dot", ["-Tsvg"]);
    const outChunks: Buffer[] = [];
    const errChunks: Buffer[] = [];

    proc.stdout.on("data", chunk => outChunks.push(chunk as Buffer));
    proc.stderr.on("data", chunk => errChunks.push(chunk as Buffer));

    let completed: boolean = false;

    proc.once("error", e => {
      if (completed) {
        return;
      }
      completed = true;
      const out: string = Buffer.concat(outChunks).toString("UTF-8");
      const err: string = Buffer.concat(errChunks).toString("UTF-8");
      const error: Error = new Error("SubprocessError");
      // tslint:disable-next-line:prefer-object-spread
      reject(Object.assign(error, {out, err, cause: e}));
    });

    proc.once("exit", (code, signal) => {
      if (completed) {
        return;
      }
      completed = true;
      const out: string = Buffer.concat(outChunks).toString("UTF-8");
      const err: string = Buffer.concat(errChunks).toString("UTF-8");
      if (code === 0 && signal === null && err.length === 0) {
        resolve(out);
      } else {
        const error: Error = new Error("EndError");
        // tslint:disable-next-line:prefer-object-spread
        reject(Object.assign(error, {out, err, code, signal}));
      }
    });

    proc.stdin.write(dot);
    proc.stdin.end();
  });
}

export function emitDot(cfg: Cfg): string {
  const chunks: string[] = [];
  const writer: CfgWriter = new CfgWriter();
  chunks.push("strict digraph {");
  writer.writeCfg(chunks, cfg, "root");
  chunks.push("}");
  return chunks.join("");
}

class CfgWriter {
  public readonly emitConstants: boolean;
  private graphId: UintIterator;
  private nodeId: UintIterator;
  private nodeToId: Map<Node, string>;
  private clusterId: UintIterator;
  private clusterToId: Map<ConditionalEdge | SubCfgEdge, string>;

  constructor() {
    this.graphId = new UintIterator();
    this.nodeId = new UintIterator();
    this.nodeToId = new Map();
    this.clusterId = new UintIterator();
    this.clusterToId = new Map();
    this.emitConstants = true;
  }

  writeCfg(chunks: string[], cfg: Cfg, label: string): void {
    // The `cluster` prefix is required for proper rendering
    chunks.push(`subgraph cluster_${this.nextGraphId()} {`);
    writeSubgraphAttributes(chunks, new Map([["label", label]]));
    for (const node of cfg.iterNodes()) {
      this.writeNode(chunks, node);
    }
    const conditionals: Set<ConditionalEdge> = new Set();
    for (const {from, to, edge} of cfg.iterEdges()) {
      const fromId: string = this.getNodeId(from);
      const toId: string = this.getNodeId(to);
      this.writeEdge(chunks, conditionals, fromId, toId, edge);
    }
    for (const conditional of conditionals) {
      this.writeConditional(chunks, conditional);
    }
    chunks.push("}");
  }

  writeConditional(chunks: string[], conditional: ConditionalEdge) {
    chunks.push(`subgraph cluster_${this.nextGraphId()} {`);
    const title: string = `conditional#${this.getConditionalId(conditional)}`;
    const test: string = emitExpressionLabel(conditional.test);
    writeSubgraphAttributes(chunks, new Map([["label", `${title}\n\n${test}`]]));
    this.writeCfg(chunks, conditional.ifFalse, "ifFalse");
    this.writeCfg(chunks, conditional.ifTrue, "ifTrue");
    chunks.push("}");
  }

  writeNode(chunks: string[], node: Node): void {
    const nodeId: string = this.getNodeId(node);
    writeStringLiteral(chunks, nodeId);
    const labelChunks: string[] = [];
    switch (node.type) {
      case NodeType.End:
        labelChunks.push("end");
        break;
      case NodeType.If:
        labelChunks.push("if");
        break;
      default:
        break;
    }
    labelChunks.push(`#${nodeId}`);
    if (this.emitConstants && node.constants !== undefined) {
      labelChunks.push("\n");
      labelChunks.push("constants = ");
      if (node.constants === CP_STATE_ANY) {
        labelChunks.push("<any>");
      } else if (node.constants === CP_STATE_UNINITIALIZED) {
        labelChunks.push("<uninitialized>");
      } else {
        if (node.constants.size === 0) {
          labelChunks.push("{}");
        } else {
          labelChunks.push("{\n");
          for (const pool of node.constants) {
            labelChunks.push("  [\n");
            for (const constant of pool) {
              labelChunks.push("    ");
              labelChunks.push(JSON.stringify(constant));
              labelChunks.push(",\n");
            }
            labelChunks.push("  ],\n");
          }
          labelChunks.push("}");
        }
      }
    }
    writeAttributes(chunks, new Map([
      ["shape", "box"],
      ["label", labelChunks.join("")],
    ]));
    chunks.push(";\n");
  }

  writeEdge(chunks: string[], conditionals: Set<ConditionalEdge>, from: string, to: string, edge: Edge): void {
    writeStringLiteral(chunks, from);
    chunks.push(" -> ");
    writeStringLiteral(chunks, to);
    switch (edge.type) {
      case EdgeType.Action:
        writeAttributes(chunks, new Map([["label", emitAction(edge.action)]]));
        break;
      case EdgeType.Conditional:
        writeAttributes(chunks, new Map([["label", `conditional#${this.getConditionalId(edge)}`]]));
        conditionals.add(edge);
        break;
      case EdgeType.Expression:
        const label: string = emitExpressionLabel(edge.expression);
        writeAttributes(chunks, new Map([["label", label]]));
        break;
      case EdgeType.IfFalse:
        writeAttributes(chunks, new Map([["label", "ifFalse"]]));
        break;
      case EdgeType.IfTrue:
        writeAttributes(chunks, new Map([["label", "ifTrue"]]));
        break;
      case EdgeType.IfTest:
        writeAttributes(chunks, new Map([["label", "test"]]));
        break;
      case EdgeType.Simple:
        break;
      default:
        writeAttributes(chunks, new Map([["label", `UNKNOWN EDGE TYPE: ${edge.type} (${EdgeType[edge.type]})`]]));
        break;
    }
    chunks.push(";\n");
  }

  private nextGraphId(): string {
    return `g${this.graphId.next().value}`;
  }

  private getNodeId(node: Node): string {
    const nodeId: string | undefined = this.nodeToId.get(node);
    if (nodeId !== undefined) {
      return nodeId;
    } else {
      const nodeId: string = this.nextNodeId();
      this.nodeToId.set(node, nodeId);
      return nodeId;
    }
  }

  private nextNodeId(): string {
    return `n${this.nodeId.next().value}`;
  }

  private getConditionalId(conditional: ConditionalEdge): string {
    const clusterId: string | undefined = this.clusterToId.get(conditional);
    if (clusterId !== undefined) {
      return clusterId;
    } else {
      const clusterId: string = this.nextClusterId();
      this.clusterToId.set(conditional, clusterId);
      return clusterId;
    }
  }

  private nextClusterId(): string {
    return `c${this.clusterId.next().value}`;
  }
}

function writeStringLiteral(chunks: string[], value: string, leftAlign: boolean = false): void {
  chunks.push("\"");
  for (const cp of [...value]) {
    switch (cp) {
      case "\\":
        chunks.push("\\\\");
        break;
      case "\"":
        chunks.push("\\\"");
        break;
      case "\n":
        chunks.push(leftAlign ? "\\l" : "\\n");
        break;
      default:
        chunks.push(cp);
        break;
    }
  }
  chunks.push(leftAlign ? "\\l\"" : "\"");
}

function writeAttributes(chunks: string[], attributes: ReadonlyMap<string, string>): void {
  chunks.push("[");
  let first: boolean = true;
  for (const [key, value] of attributes) {
    if (first) {
      first = false;
    } else {
      chunks.push(", ");
    }
    writeStringLiteral(chunks, key);
    chunks.push("=");
    writeStringLiteral(chunks, value, key === "label");
  }
  chunks.push("]");
}

function writeSubgraphAttributes(chunks: string[], attributes: ReadonlyMap<string, string>): void {
  for (const [key, value] of attributes) {
    writeStringLiteral(chunks, key);
    chunks.push("=");
    writeStringLiteral(chunks, value, key === "label");
    chunks.push(";\n");
  }
}

function emitExpressionLabel(expression: PartialExpr): string {
  const chunks: string[] = [];
  if (expression.void) {
    chunks.push("void ");
  }
  chunks.push("(");
  for (let i: number = 0; i < expression.inputs; i++) {
    if (i > 0) {
      chunks.push(", ");
    }
    chunks.push(`in:${i.toString(10)}`);
  }
  chunks.push(") => ");
  chunks.push(emitExpression(expression.expr));
  return chunks.join("");
}
