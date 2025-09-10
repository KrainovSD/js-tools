import type { RequestQuery } from "../../api";
import { buildQueryString } from "./build-query-string";

type CreateURLOptionsInterface = {
  baseURL: string;
  params?: RequestQuery;
};

export function createURLWithQueries(options: CreateURLOptionsInterface): string {
  const url = options.baseURL;

  if (!options.params) {
    return url;
  }

  const queryString = buildQueryString(options.params);

  return `${url}?${queryString}`;
}
