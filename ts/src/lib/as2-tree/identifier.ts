export interface Identifier {
  type: "identifier";
  value: string;
}

export function makeIdentifier(value: string): Identifier {
  return {type: "identifier", value};
}
