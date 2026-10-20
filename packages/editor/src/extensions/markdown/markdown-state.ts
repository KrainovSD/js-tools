import { StateEffect, StateField } from "@codemirror/state";
import { randomString } from "@/lib/utils";
import type { MarkdownState } from "./markdown-types";

export const openedImageEffect = StateEffect.define<string | undefined>();
export const openedLinkEffect = StateEffect.define<string | undefined>();

export const markdownState = StateField.define<MarkdownState>({
  create() {
    return {
      openedImage: undefined,
      openedLink: undefined,
      uniqueId: randomString(10),
    };
  },

  update(value, transaction) {
    const newValue = { ...value };

    for (const effect of transaction.effects) {
      if (effect.is(openedImageEffect)) newValue.openedImage = effect.value;
      if (effect.is(openedLinkEffect)) newValue.openedLink = effect.value;
    }

    return newValue;
  },
});
