import type { Extension } from "@codemirror/state";
import { SearchState } from "./search-state";

export * from "./search-lib";
export type * from "./search-model";
export * from "./search-state";

export function NewSearch(): Extension[] {
  return [SearchState];
}
