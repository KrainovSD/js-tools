import { IS_BROWSER, IS_JEST } from "../../constants";
import { isArray, isString } from "../typings";

export function getQueryValues<K extends string>(
  keys: K[],
): Record<K, string | string[] | undefined> | null {
  if (!IS_BROWSER && !IS_JEST) return null;

  const object: Record<K, string | string[] | undefined> = {} as Record<
    K,
    string | string[] | undefined
  >;

  const queries = window.location.search.substring(1).split("&");
  for (const query of queries) {
    const [key, value] = query.split("=");
    if (keys.includes(key as K) && value) {
      const prev = object[key as K];
      if (isArray(prev)) prev.push(value);
      else if (isString(prev)) object[key as K] = [prev, value];
      else object[key as K] = value;
    }
  }

  return object;
}
