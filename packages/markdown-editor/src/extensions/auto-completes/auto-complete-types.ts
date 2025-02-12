import type { autocompletion } from "@codemirror/autocomplete";

export type InitAutoCompleteOptions = {
  autoCompleteTagOptions?: string[];
  autoCompleteConfig?: Omit<Exclude<Parameters<typeof autocompletion>[0], undefined>, "override">;
};
