export interface Input {
  type: "_input";
  id: number;
}

export function makeInput(id: number): Input {
  return {type: "_input", id};
}
