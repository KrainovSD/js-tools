import type { ParamsType } from "../../types";
import { buildQueryString } from "./build-query-string";

type CreateURLOptionsInterface = {
  baseURL: string;
  params?: ParamsType;
};

export function createURLWithParams(options: CreateURLOptionsInterface): string {
  const url = options.baseURL.replace(/\/$/, "").replace(/\?$/, "");

  if (!options.params) {
    return url;
  }

  const queryString = buildQueryString(options.params);

  return `${url}?${queryString}`;
}
