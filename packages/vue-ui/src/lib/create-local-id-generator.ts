import { randomString } from "@krainovsd/js-helpers";

export function createLocalIdGenerator(mask?: false): () => number;
export function createLocalIdGenerator(mask: true): () => string;

export function createLocalIdGenerator(withMask?: boolean): () => string | number {
  let id = 0;
  const mask = withMask ? randomString(5) : "";

  return function generateId() {
    if (withMask) {
      return `${id++}:${mask}`;
    }

    return id++;
  };
}
