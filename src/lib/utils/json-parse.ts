import { isString } from "../typings";

export function jsonParse<T>(json: unknown): T | null {
  if (!isString(json)) return null;

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
