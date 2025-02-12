import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_OF_LINE_BREAK,
  CODE_OF_SPACE,
  CODE_OF_START_MENTION,
  NAME_OF_MENTION,
} from "./mention-constants";

export const mentionParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_MENTION }],
  parseInline: [
    {
      name: NAME_OF_MENTION,
      parse(cx, code, pos) {
        if (code != CODE_OF_START_MENTION) return -1;
        const nextCode = cx.char(pos + 1);
        if (nextCode === -1 || nextCode === CODE_OF_SPACE || nextCode === CODE_OF_LINE_BREAK)
          return -1;

        let end: number = pos + 1;
        for (let i = pos + 1; i < cx.end; i++) {
          const nextCode = cx.char(i);
          if (nextCode === -1 || nextCode === CODE_OF_SPACE || nextCode === CODE_OF_LINE_BREAK)
            break;
          end++;
        }

        return cx.addElement(cx.elt(NAME_OF_MENTION, pos, end));
      },
    },
  ],
};
