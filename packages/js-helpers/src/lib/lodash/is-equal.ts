import { isObject } from "../typings";

export function isEqual(aVal: unknown, bVal: unknown) {
  if (aVal === bVal) return true;

  if (
    aVal == undefined ||
    bVal == undefined ||
    typeof aVal !== "object" ||
    typeof bVal !== "object"
  ) {
    return aVal === bVal;
  }

  if (aVal instanceof Date && bVal instanceof Date) {
    return aVal.getTime() === bVal.getTime();
  }

  if (aVal instanceof RegExp && bVal instanceof RegExp) {
    return aVal.toString() === bVal.toString();
  }

  if (aVal.constructor !== bVal.constructor) {
    return false;
  }

  if (Array.isArray(aVal) && Array.isArray(bVal)) {
    if (aVal.length !== bVal.length) return false;
    for (let i = 0; i < aVal.length; i++) {
      if (!isEqual(aVal[i], bVal[i])) return false;
    }

    return true;
  }

  if (isObject(aVal) && isObject(bVal)) {
    const keysA = Object.keys(aVal);
    const keysB = Object.keys(bVal);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isEqual(aVal[key], bVal[key])) return false;
    }
  }

  return true;
}
