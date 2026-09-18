import { tags } from "@lezer/highlight";
import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_OF_END_SHORT_LINK,
  CODE_OF_LINE_BREAK,
  CODE_OF_SPACE,
  CODE_OF_START_SHORT_LINK,
  NAME_OF_SHORT_LINK,
  NAME_OF_SHORT_LINK_MARK,
} from "./short-link-constants";

export const shortLinkParser: MarkdownConfig = {
  defineNodes: [
    { name: NAME_OF_SHORT_LINK, style: tags.link },
    { name: NAME_OF_SHORT_LINK_MARK, style: tags.processingInstruction },
  ],
  parseInline: [
    {
      name: NAME_OF_SHORT_LINK,
      before: "Link",
      parse(cx, code, pos) {
        if (code !== CODE_OF_START_SHORT_LINK || cx.char(pos + 1) !== CODE_OF_START_SHORT_LINK)
          return -1;
        for (let i = pos + 2; i < cx.end - 1; i++) {
          const charCode = cx.char(i);
          if (
            charCode === CODE_OF_LINE_BREAK ||
            charCode === CODE_OF_SPACE ||
            charCode === CODE_OF_START_SHORT_LINK
          )
            return -1;
          if (charCode !== CODE_OF_END_SHORT_LINK || cx.char(i + 1) !== CODE_OF_END_SHORT_LINK)
            continue;
          if (i === pos + 2) return -1;
          return cx.addElement(
            cx.elt(NAME_OF_SHORT_LINK, pos, i + 2, [
              cx.elt(NAME_OF_SHORT_LINK_MARK, pos, pos + 2),
              cx.elt(NAME_OF_SHORT_LINK_MARK, i, i + 2),
            ]),
          );
        }
        return -1;
      },
    },
  ],
};
