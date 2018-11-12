import cp from "child_process";
import { emitExpression } from "../as2-emitter/expression";
import { emitAction } from "../avm1-asm-emitter/action";
import { Cfg, CfgEdge, CfgEdgeType } from "../cfg";
import { PartialExpr } from "../partial-expr";
import { UintIterator } from "../uint-iterator";

export async function emitSvg(cfg: Cfg): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const dot: string = emitDot(cfg);
    const proc: cp.ChildProcess = cp.spawn("dot", ["-Tsvg"]);
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
  writer.writeCfg(chunks, cfg);
  chunks.push("}");
  return chunks.join("");
}

class CfgWriter {
  private graphId: UintIterator;
  private nodeId: UintIterator;
  private internalToPublicNodeId: Map<number, string>;

  constructor() {
    this.graphId = new UintIterator();
    this.nodeId = new UintIterator();
    this.internalToPublicNodeId = new Map();
  }

  writeCfg(chunks: string[], cfg: Cfg): void {
    chunks.push(`subgraph ${this.nextGraphId()} {`);
    const source: string = this.getNodeId(cfg.getSource());
    writeStringLiteral(chunks, source);
    chunks.push(";\n");
    const knownNodes: Set<string> = new Set([source]);
    for (const {from, to, edge} of cfg.iterEdges()) {
      const fromId: string = this.getNodeId(from);
      const toId: string = this.getNodeId(to);
      if (!knownNodes.has(fromId)) {
        writeStringLiteral(chunks, fromId);
        chunks.push(";\n");
        knownNodes.add(fromId);
      }
      if (!knownNodes.has(toId)) {
        writeStringLiteral(chunks, toId);
        chunks.push(";\n");
        knownNodes.add(toId);
      }
      this.writeEdge(chunks, fromId, toId, edge);
    }
    chunks.push("}");
  }

  writeEdge(chunks: string[], from: string, to: string, edge: CfgEdge): void {
    writeStringLiteral(chunks, from);
    chunks.push(" -> ");
    writeStringLiteral(chunks, to);
    switch (edge.type) {
      case CfgEdgeType.Action:
        writeAttributes(chunks, new Map([["label", emitAction(edge.action)]]));
        break;
      case CfgEdgeType.Expression:
        const label: string = emitExpressionLabel(edge.expression);
        writeAttributes(chunks, new Map([["label", label]]));
        break;
      case CfgEdgeType.IfFalse:
        writeAttributes(chunks, new Map([["label", "ifFalse"]]));
        break;
      case CfgEdgeType.IfTrue:
        writeAttributes(chunks, new Map([["label", "ifTrue"]]));
        break;
      case CfgEdgeType.Test:
        writeAttributes(chunks, new Map([["label", "test"]]));
        break;
      default:
        break;
    }
    chunks.push(";\n");
  }

  private nextGraphId(): string {
    return `g${this.graphId.next().value}`;
  }

  private getNodeId(internalId: number): string {
    const publicNodeId: string | undefined = this.internalToPublicNodeId.get(internalId);
    if (publicNodeId !== undefined) {
      return publicNodeId;
    }
    const nodeId: string = this.nextNodeId();
    this.internalToPublicNodeId.set(internalId, nodeId);
    return nodeId;
  }

  private nextNodeId(): string {
    return `n${this.nodeId.next().value}`;
  }
}

function writeStringLiteral(chunks: string[], value: string, leftAlign: boolean = false): void {
  if (leftAlign) {
    // TODO: More reliable replacement
    chunks.push(JSON.stringify(value).replace(/\\n/g, "\\l").replace(/"$/, "\\l\""));
  } else {
    chunks.push(JSON.stringify(value));
  }
}

function writeAttributes(chunks: string[], attributes: ReadonlyMap<string, string>): void {
  chunks.push("[");
  let first: boolean = true;
  for (const [key, value] of attributes) {
    writeStringLiteral(chunks, key);
    chunks.push("=");
    writeStringLiteral(chunks, value, true);
    if (first) {
      first = false;
    } else {
      chunks.push(", ");
    }
  }
  chunks.push("]");
}

function emitExpressionLabel(expression: PartialExpr): string {
  const chunks: string[] = [];
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
