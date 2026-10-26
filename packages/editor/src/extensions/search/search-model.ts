export type SearchMatch = {
  from: number;
  to: number;
};

export type SearchStateType = {
  query: string;
  codes: number[];
  matches: SearchMatch[];
  index: number;
};

export const MAX_SEARCH_MATCHES = 10000;

export const SEARCH_CLASSES = {
  match: "ksd-cm-search-match",
  matchActive: "ksd-cm-search-match-active",
};
