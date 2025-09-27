import { isPrimitive } from "../typings";
import { type } from "./type";

export function cloneDeep<T>(value: T): T {
  if (isPrimitive(value)) {
    return value;
  }

  function copy(copiedValue: object) {
    for (const key in value as object) {
      if (Object.hasOwn(value as object, key)) {
        (copiedValue as Record<string, unknown>)[key] = cloneDeep(
          (value as Record<string, unknown>)[key],
        );
      }
    }

    return copiedValue;
  }

  switch (type(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value) as object) as object) as T;
    case "Array":
      return copy(Array((value as unknown[]).length)) as T;
    case "Date":
      return new Date((value as Date).valueOf()) as T;
    case "RegExp":
      return cloneRegExp(value as RegExp) as T;
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
      return (value as Int8Array).slice() as T;
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
