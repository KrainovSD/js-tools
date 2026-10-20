import type { CompletionSource, autocompletion } from "@codemirror/autocomplete";

export type EditorAutoCompleteConfig = Omit<
  Exclude<Parameters<typeof autocompletion>[0], undefined>,
  "override"
>;

export type AutoCompleteOptions = {
  tags?: string[];
  config?: EditorAutoCompleteConfig;
  sources?: CompletionSource[];
};

export const DefaultAutoCompleteOptions = {
  activateOnTyping: true,
  activateOnTypingDelay: 100,
  selectOnOpen: true,
  closeOnBlur: true,
  maxRenderedOptions: 20,
  aboveCursor: false,
  defaultKeymap: true,
  icons: false,
  filterStrict: false,
  interactionDelay: 75,
  updateSyncTime: 100,
};
