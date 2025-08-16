export function differenceBy<T extends Record<string, unknown>>(
  first: T[],
  second: T[],
  key: keyof T,
): T[] {
  let idx = 0;
  const out = [];
  const toFilterOut = new Set();

  for (let i = 0; i < second.length; i += 1) {
    toFilterOut.add(second[i][key]);
  }

  while (idx < first.length) {
    if (!toFilterOut.has(first[idx][key])) {
      out.push(first[idx]);
    }
    idx += 1;
  }

  return out;
}
