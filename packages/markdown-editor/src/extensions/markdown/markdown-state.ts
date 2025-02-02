import { StateEffect, StateField } from "@codemirror/state";
import type { MarkdownState } from "./markdown-types";

export const openedImageEffect = StateEffect.define<string>();

export const markdownState = StateField.define<MarkdownState>({
  create() {
    return {
      openedImage: undefined,
    };
  },

  update(value, transaction) {
    const newValue = { ...value };

    // console.log(value, transaction);
    for (const effect of transaction.effects) {
      if (effect.is(openedImageEffect)) newValue.openedImage = effect.value;
    }

    return newValue;
  },
});
