import { IS_BROWSER, IS_JEST } from "../../constants";

export function extractQueries() {
  const queryMap: Record<string, string[] | undefined> = {};
  if (!IS_BROWSER && !IS_JEST) return queryMap;

  const queryString = document.location.search;
  queryString
    .replace(/^\?/, "")
    .split("&")
    .forEach((query) => {
      const [key, value] = query.split("=", 2);

      queryMap[key] ??= [];
      const prev = queryMap[key];
      prev.push(value);
    });

  return queryMap;
}
