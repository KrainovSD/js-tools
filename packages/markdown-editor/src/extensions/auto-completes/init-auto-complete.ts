import { autocompletion } from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";
import type { InitAutoCompleteOptions } from "./auto-complete-types";
import { tagAutoComplete } from "./custom";

export const initAutoComplete = ({
  autoCompleteTagOptions,
  autoCompleteConfig = {},
}: InitAutoCompleteOptions): Extension => {
  if (!autoCompleteTagOptions) return [];

  return [
    autocompletion({
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
      ...autoCompleteConfig,
      override: [tagAutoComplete(autoCompleteTagOptions)],
    }),
  ];
};
