import clone from "lodash/cloneDeep";
import getByPath from "lodash/get";
import setByPath from "lodash/set";
import shuffleLodash from "lodash/shuffle";
import { Maybe } from "../types";
import typings from "../typings";

function get(
  object: Maybe<Record<string, unknown>>,
  path: Maybe<string>,
  defaultValue: unknown = null,
) {
  if (!typings.isObject(object) || !typings.isString(path)) return defaultValue;

  return getByPath(object, path, defaultValue);
}

function set(object: Record<string, unknown>, path: string, value: unknown) {
  setByPath(object, path, value);
}

function cloneDeep<T>(value: T) {
  return clone(value);
}

function shuffle<T extends unknown[]>(list: T) {
  return shuffleLodash(list) as T;
}

export default { get, set, cloneDeep, shuffle };
