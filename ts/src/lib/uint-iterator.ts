import { UintSize } from "semantic-types";

export class UintIterator implements Iterator<UintSize> {
  private value: UintSize;

  constructor() {
    this.value = 0;
  }

  next(): IteratorResult<UintSize> {
    const value: UintSize = this.value;
    this.value += 1;
    return {value, done: false};
  }
}
