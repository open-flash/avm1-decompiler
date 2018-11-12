import sysPath from "path";

import meta from "./meta.js";

export const FIXTURES_ROOT: string = sysPath.join(meta.dirname, "fixtures");

export interface Fixture {
  name: string;
  avm1Path: string;
}

export function* getFixtures(): IterableIterator<Fixture> {
  const names: ReadonlyArray<string> = [
    "hello-world",
    "sample-03",
  ];
  for (const name of names) {
    const avm1Path: string = sysPath.join(FIXTURES_ROOT, `${name}.avm1`);
    yield {name, avm1Path};
  }
}
