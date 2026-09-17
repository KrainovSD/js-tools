import type { autocompletion } from "@codemirror/autocomplete";

export type EditorAutoCompleteConfig = Omit<
  Exclude<Parameters<typeof autocompletion>[0], undefined>,
  "override"
>;

export type AutoCompleteOptions = {
  tags: string[];
  config?: EditorAutoCompleteConfig;
};
