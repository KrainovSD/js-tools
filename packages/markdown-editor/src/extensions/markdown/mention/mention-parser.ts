import type { MarkdownConfig } from "@lezer/markdown";
import { CODE_OF_SPACE, CODE_OF_START_MENTION, NAME_OF_MENTION } from "./mention-constants";

export const mentionParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_MENTION }],
  parseInline: [
    {
      name: NAME_OF_MENTION,
      parse(cx, next, pos) {
        if (next != CODE_OF_START_MENTION) return -1;
        let end: number = pos + 1;
        for (let i = pos + 1; i < cx.end; i++) {
          const next = cx.char(i);
          if (next === CODE_OF_SPACE) break;
          end++;
        }

        return cx.addElement(cx.elt(NAME_OF_MENTION, pos, end));
      },
    },
  ],
};
