import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_POINT_OF_SPACE,
  CODE_POINT_OF_START_MENTION,
  MENTION_MARK,
} from "./mention-constants";

export const mentionParser: MarkdownConfig = {
  defineNodes: [{ name: MENTION_MARK }],
  parseInline: [
    {
      name: MENTION_MARK,
      parse(cx, next, pos) {
        if (next != CODE_POINT_OF_START_MENTION) return -1;
        let end: number = pos + 1;
        for (let i = pos + 1; i < cx.end; i++) {
          const next = cx.char(i);
          if (next === CODE_POINT_OF_SPACE) break;
          end++;
        }

        return cx.addElement(cx.elt(MENTION_MARK, pos, end));
      },
    },
  ],
};
