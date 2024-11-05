import type { ParamsType } from "../../types";
import { isArray, isObject } from "../typings";

export function buildQueryString(params: ParamsType): string {
  const queryString: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (isObject(value) || value == undefined) continue;

    if (isArray(value)) {
      for (const item of value) {
        if (item != undefined && !isObject(item))
          queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
    } else {
      queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  return queryString.join("&");
}
