/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isPrimitive } from "../typings";
import { type } from "./type";

export function cloneDeep(value: unknown, map?: Map<unknown, unknown>) {
  map ??= new Map();

  // this avoids the slower switch with a quick if decision removing some milliseconds in each run.
  if (isPrimitive(value)) {
    return value;
  }

  function copy(copiedValue: object) {
    // Check for circular and same references on the object graph and return its corresponding clone.
    const cachedCopy = map!.get(value);

    if (cachedCopy) {
      return cachedCopy;
    }

    map!.set(value, copiedValue);

    for (const key in value as object) {
      if (Object.hasOwn(value as object, key)) {
        (copiedValue as Record<string, unknown>)[key] = cloneDeep(
          (value as Record<string, unknown>)[key],
          map,
        );
      }
    }

    return copiedValue;
  }

  switch (type(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value) as object) as object);
    case "Array":
      return copy(Array((value as unknown[]).length));
    case "Date":
      return new Date((value as Date).valueOf());
    case "RegExp":
      return cloneRegExp(value as RegExp);
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
      return (value as Int8Array).slice();
    default:
      return value;
  }
}

function cloneRegExp(pattern: RegExp) {
  return new RegExp(
    pattern.source,
    pattern.flags
      ? pattern.flags
      : (pattern.global ? "g" : "") +
        (pattern.ignoreCase ? "i" : "") +
        (pattern.multiline ? "m" : "") +
        (pattern.sticky ? "y" : "") +
        (pattern.unicode ? "u" : "") +
        (pattern.dotAll ? "s" : ""),
  );
}
