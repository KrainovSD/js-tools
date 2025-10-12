import isEqual from "lodash/isEqual";

export function getRootDiff(
  object: Record<string, unknown>,
  mirror: Record<string, unknown>,
): Set<string> {
  const changedKeys = new Set<string>();

  for (const key in object) {
    if (!isEqual(object[key], mirror[key])) {
      changedKeys.add(key);
    }
  }

  return changedKeys;
}
