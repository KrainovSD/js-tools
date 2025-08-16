import get from "lodash/get";
import { isArray, isObject, isString } from "../typings";

export function getByPath<T, D = undefined>(data: unknown, path?: string, defaultValue?: D): T | D {
  if ((!isObject(data) && !isArray(data)) || !isString(path)) return defaultValue as D;

  return get(data, path, defaultValue) as T | D;
}
