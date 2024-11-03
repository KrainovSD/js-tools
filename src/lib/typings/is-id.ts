import { isNumber } from "./is-number";
import { isString } from "./is-string";

export function isId(value: unknown): value is number | string {
  return isNumber(value) || isString(value);
}
