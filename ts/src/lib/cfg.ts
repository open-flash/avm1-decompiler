import { Avm1Parser } from "avm1-parser";
import { Action, ActionType } from "avm1-tree";
import { UintIterator } from "./uint-iterator";
import { PartialExpr } from "./partial-expr";

const UID_ITERATOR: UintIterator = new UintIterator();

export interface BoundEdge<E extends CfgEdge = CfgEdge> {
  from: number;
  to: number;
  edge: E;
}

// Control flow graph
export class Cfg {
  private source: number;
  // private nodes: Set<number>;
  private readonly outEdges: Map<number, Map<number, CfgEdge>>;
  private readonly inEdges: Map<number, Map<number, CfgEdge>>;

  constructor() {
    this.outEdges = new Map();
    this.inEdges = new Map();
    this.source = UID_ITERATOR.next().value;
  }

  public static fromAvm1(avm1: Uint8Array): Cfg {
    const result: Cfg = new Cfg();
    const source: number = result.getSource();
    const avm1Parser: Avm1Parser = new Avm1Parser(avm1);
    const offsetToId: Map<number, number> = new Map([[0, source]]);
    const closedSet: Set<number> = new Set();
    const openSet: number[] = [0];
    while (openSet.length > 0) {
      const curOffset: number = openSet.pop()!;
      const curId: number = offsetToId.get(curOffset)!;
      closedSet.add(curOffset);
      const action: Action | undefined = avm1Parser.readAt(curOffset);
      if (action === undefined) {
        continue;
      }
      switch (action.action) {
        case ActionType.If: {
          const testId: number = result.appendTestEdge(curId);
          const falseOffset: number = avm1Parser.getBytePos();
          let falseId: number | undefined = offsetToId.get(falseOffset);
          if (falseId === undefined) {
            falseId = result.appendIfFalseEdge(testId);
            openSet.push(falseOffset);
            offsetToId.set(falseOffset, falseId);
          } else {
            result.addIfFalseEdge(testId, falseId);
          }
          const trueOffset: number = falseOffset + action.offset;
          let trueId: number | undefined = offsetToId.get(trueOffset);
          if (trueId === undefined) {
            trueId = result.appendIfTrueEdge(testId);
            openSet.push(trueOffset);
            offsetToId.set(trueOffset, trueId);
          } else {
            result.addIfTrueEdge(testId, trueId);
          }
          break;
        }
        case ActionType.Jump: {
          const nextOffset: number = avm1Parser.getBytePos() + action.offset;
          let nextId: number | undefined = offsetToId.get(nextOffset);
          if (nextId === undefined) {
            nextId = result.appendSimpleEdge(curId);
            openSet.push(nextOffset);
            offsetToId.set(nextOffset, nextId);
          } else {
            result.addSimpleEdge(curId, nextId);
          }
          break;
        }
        default: {
          const nextOffset: number = avm1Parser.getBytePos();
          let nextId: number | undefined = offsetToId.get(nextOffset);
          if (nextId === undefined) {
            nextId = result.appendActionEdge(curId, action);
            openSet.push(nextOffset);
            offsetToId.set(nextOffset, nextId);
          } else {
            result.addActionEdge(curId, nextId, action);
          }
          break;
        }
      }
    }

    return result;
  }

  addIfFalseEdge(from: number, to: number): void {
    const edge: IfFalse = {type: CfgEdgeType.IfFalse};
    this.addEdge(from, to, edge);
  }

  appendIfFalseEdge(from: number): number {
    const to: number = this.createNode();
    this.addIfFalseEdge(from, to);
    return to;
  }

  addIfTrueEdge(from: number, to: number): void {
    const edge: IfTrue = {type: CfgEdgeType.IfTrue};
    this.addEdge(from, to, edge);
  }

  appendIfTrueEdge(from: number): number {
    const to: number = this.createNode();
    this.addIfTrueEdge(from, to);
    return to;
  }

  addSimpleEdge(from: number, to: number): void {
    const edge: SimpleEdge = {type: CfgEdgeType.Simple};
    this.addEdge(from, to, edge);
  }

  appendSimpleEdge(from: number): number {
    const to: number = this.createNode();
    this.addSimpleEdge(from, to);
    return to;
  }

  addActionEdge(from: number, to: number, action: Action): void {
    const edge: ActionEdge = {type: CfgEdgeType.Action, action};
    this.addEdge(from, to, edge);
  }

  appendActionEdge(from: number, action: Action): number {
    const to: number = this.createNode();
    this.addActionEdge(from, to, action);
    return to;
  }

  addExpressionEdge(from: number, to: number, expression: PartialExpr): void {
    const edge: ExpressionEdge = {type: CfgEdgeType.Expression, expression};
    this.addEdge(from, to, edge);
  }

  appendExpressionEdge(from: number, expression: PartialExpr): number {
    const to: number = this.createNode();
    this.addExpressionEdge(from, to, expression);
    return to;
  }

  addTestEdge(from: number, to: number): void {
    const edge: TestEdge = {type: CfgEdgeType.Test};
    this.addEdge(from, to, edge);
  }

  appendTestEdge(from: number): number {
    const to: number = this.createNode();
    this.addTestEdge(from, to);
    return to;
  }

  getSource(): number {
    return this.source;
  }

  * iterEdges(): IterableIterator<BoundEdge> {
    const closedSet: Set<number> = new Set();
    const openSet: number[] = [this.source];
    while (openSet.length > 0) {
      const from: number = openSet.pop()!;
      const outEdges: Map<number, CfgEdge> | undefined = this.outEdges.get(from);
      if (outEdges === undefined) {
        continue;
      }
      for (const [to, edge] of outEdges) {
        yield {from, to, edge};
        if (!closedSet.has(to)) {
          openSet.push(to);
        }
      }
      closedSet.add(from);
    }
  }

  public removeEdge(from: number, to: number): void {
    this.outEdges.delete(from);
    this.inEdges.delete(to);
  }

  public addEdge(from: number, to: number, edge: CfgEdge): void {
    let outEdges: Map<number, CfgEdge> | undefined = this.outEdges.get(from);
    if (outEdges === undefined) {
      outEdges = new Map();
      this.outEdges.set(from, outEdges);
    }
    outEdges.set(to, edge);
    let inEdges: Map<number, CfgEdge> | undefined = this.inEdges.get(to);
    if (inEdges === undefined) {
      inEdges = new Map();
      this.inEdges.set(to, inEdges);
    }
    inEdges.set(from, edge);
  }

  private createNode(): number {
    return UID_ITERATOR.next().value;
  }
}

export type CfgEdge = ActionEdge | ExpressionEdge | IfFalse | IfTrue | SimpleEdge | SubCfgEdge | TestEdge;

export enum CfgEdgeType {
  Action,
  IfTrue,
  IfFalse,
  Expression,
  Simple,
  Sub,
  Test,
}

export interface SimpleEdge {
  readonly type: CfgEdgeType.Simple;
}

export interface IfTrue {
  readonly type: CfgEdgeType.IfTrue;
}

export interface IfFalse {
  readonly type: CfgEdgeType.IfFalse;
}

export interface TestEdge {
  readonly type: CfgEdgeType.Test;
}

export interface ActionEdge<A extends Action = Action> {
  readonly type: CfgEdgeType.Action;
  readonly action: A;
}

export interface SubCfgEdge {
  readonly type: CfgEdgeType.Sub;
}

export interface ExpressionEdge {
  readonly type: CfgEdgeType.Expression;
  readonly expression: PartialExpr;
}

// struct
// FlowGraph
// {
//   source_block: Block,
//     blocks
// :
//   Vec < Block >,
// }
//
// /**
//  * This block corresponds to the end of the script.
//  */
// struct
// TerminalBlock
// {
// }
//
// /**
//  * This basic block leads to an other basic block.
//  */
// struct
// JumpBlock
// {
// }
//
// /**
//  * There are two possible next basick blocks. The destination is chosen
//  * depending on a test operand.
//  */
// struct
// ConditionalJumpBlock
// {
// }
//
// /**
//  * This basic returns a value from the current function.
//  */
// struct
// ReturnBlock
// {
// }
//
// struct
// TryBlock
// {
// }
//
// struct
// WithBlock
// {
// }
//
// enum Block {
//   ConditionalJumpBlock,
//   JumpBlock,
//   TerminalBlock,
//   TryBlock,
//   WithBlock,
// }
