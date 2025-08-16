export function differenceWith<T = unknown>(
  first: T[],
  second: T[],
  extractPrimitive: (el: T) => string | number | boolean | undefined | null,
): T[] {
  let idx = 0;
  const out = [];
  const toFilterOut = new Set();

  for (let i = 0; i < second.length; i += 1) {
    toFilterOut.add(extractPrimitive(second[i]));
  }

  while (idx < first.length) {
    if (!toFilterOut.has(extractPrimitive(first[idx]))) {
      out.push(first[idx]);
    }
    idx += 1;
  }

  return out;
}
