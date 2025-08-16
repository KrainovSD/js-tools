export function difference<T extends string | number | boolean | null | undefined>(
  first: T[],
  second: T[],
): T[] {
  let idx = 0;
  const out: T[] = [];
  const toFilterOut = new Set();

  for (let i = 0; i < second.length; i += 1) {
    toFilterOut.add(second[i]);
  }

  while (idx < first.length) {
    if (!toFilterOut.has(first[idx])) {
      out[out.length] = first[idx];
    }
    idx += 1;
  }

  return out;
}
