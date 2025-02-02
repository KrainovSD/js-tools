import { StateEffect, StateField } from "@codemirror/state";
import type { MarkdownState } from "./markdown-types";

export const openedImageEffect = StateEffect.define<string | undefined>();
export const imageSrcGetterEffect = StateEffect.define<((src: string) => string) | undefined>();

export const markdownState = StateField.define<MarkdownState>({
  create() {
    return {
      openedImage: undefined,
      imageSrcGetter: undefined,
    };
  },

  update(value, transaction) {
    const newValue = { ...value };

    for (const effect of transaction.effects) {
      if (effect.is(openedImageEffect)) newValue.openedImage = effect.value;
      if (effect.is(imageSrcGetterEffect)) newValue.imageSrcGetter = effect.value;
    }

    return newValue;
  },
});
