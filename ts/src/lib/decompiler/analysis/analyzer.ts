import { RoNode } from "../../as2-types/node";

export interface InputOutput<T> {
  input: T;
  output: T;
}

export interface FlowAnalyzer<T> {
  transfer(node: RoNode, input: T): T;
}

export class InputOutputAnalyzer<T> implements FlowAnalyzer<T> {
  private readonly analysis: WeakMap<RoNode, InputOutput<T>>;
  private readonly innerTransfer: (analyzer: FlowAnalyzer<T>, node: RoNode, input: T) => T;

  private constructor(
    innerTransfer: (analyzer: FlowAnalyzer<T>, node: RoNode<any>, input: T) => T,
  ) {
    this.analysis = new WeakMap();
    this.innerTransfer = innerTransfer;
  }

  public static analyze<N extends RoNode, T>(
    root: N,
    input: T,
    innerTransfer: (analyzer: FlowAnalyzer<T>, node: RoNode<N["loc"]>, input: T) => T,
  ): WeakMap<RoNode<N["loc"]>, InputOutput<T>> {
    const analyzer: InputOutputAnalyzer<T> = new InputOutputAnalyzer(innerTransfer);
    analyzer.transfer(root, input);
    return analyzer.analysis;
  }

  public transfer(node: RoNode, input: T): T {
    const output: T = this.innerTransfer(this, node, input);
    this.analysis.set(node, {input, output});
    return output;
  }
}
