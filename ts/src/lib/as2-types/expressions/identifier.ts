export interface Identifier<L = unknown> {
  type: "Identifier";
  loc: L;
  name: string;
}

export interface RoIdentifier<L = unknown> {
  readonly type: "Identifier";
  readonly loc: L;
  readonly name: string;
}
