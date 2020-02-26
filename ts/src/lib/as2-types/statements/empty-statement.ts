export interface EmptyStatement<L = unknown> {
  type: "EmptyStatement";
  loc: L;
}

export interface RoEmptyStatement<L = unknown> {
  readonly type: "EmptyStatement";
  readonly loc: L;
}
