export interface IdentifierPattern<L = unknown> {
  type: "IdentifierPattern";
  loc: L;
  name: string;
}

export interface RoIdentifierPattern<L = unknown> {
  readonly type: "IdentifierPattern";
  readonly loc: L;
  readonly name: string;
}
