import set from "lodash/set";
import { isArray, isObject } from "../typings";

export function setByPath(data: Record<string, unknown> | unknown[], path: string, value: unknown) {
  try {
    if (!isObject(data) && !isArray(data)) throw new Error("bad data");

    set(data, path, value);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}
