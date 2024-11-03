import { isId } from "../typings";

export function arrayToMapByKey<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
): Record<string, T> {
  const map: Record<string, T> = {};

  for (const item of array) {
    const keyValue = item[key] as unknown;
    if (isId(keyValue)) map[keyValue] = item;
  }

  return map;
}
