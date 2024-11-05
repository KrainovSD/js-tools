import get from "lodash/get";
import { isArray, isObject, isString } from "../typings";

export function getByPath<T>(data: unknown, path?: string, defaultValue: unknown = undefined): T {
  if ((!isObject(data) && !isArray(data)) || !isString(path)) return defaultValue as T;

  return get(data, path, defaultValue) as T;
}
