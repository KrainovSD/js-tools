import { tags } from "@lezer/highlight";
import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_OF_UNDERLINE_MARK,
  NAME_OF_UNDERLINE,
  NAME_OF_UNDERLINE_MARK,
  UNDERLINE_TAG,
} from "./underline-constants";

const UNDERLINE_DELIMITER = {
  resolve: NAME_OF_UNDERLINE,
  mark: NAME_OF_UNDERLINE_MARK,
};

function isWhitespace(code: number): boolean {
  return (
    code === -1 ||
    Number.isNaN(code) ||
    code === 32 ||
    (code >= 9 && code <= 13) ||
    code === 0xa0 ||
    code === 0x1680 ||
    (code >= 0x2000 && code <= 0x200a) ||
    code === 0x2028 ||
    code === 0x2029 ||
    code === 0x202f ||
    code === 0x205f ||
    code === 0x3000 ||
    code === 0xfeff
  );
}

function isPunctuation(code: number): boolean {
  return (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126) ||
    code === 0xa1 ||
    (code >= 0x2010 && code <= 0x2027)
  );
}

export const underlineParser: MarkdownConfig = {
  defineNodes: [
    { name: NAME_OF_UNDERLINE, style: UNDERLINE_TAG },
    { name: NAME_OF_UNDERLINE_MARK, style: tags.processingInstruction },
  ],
  parseInline: [
    {
      name: NAME_OF_UNDERLINE,
      before: "Superscript",
      parse(cx, code, pos) {
        if (
          code !== CODE_OF_UNDERLINE_MARK ||
          cx.char(pos + 1) !== CODE_OF_UNDERLINE_MARK ||
          cx.char(pos + 2) === CODE_OF_UNDERLINE_MARK
        ) {
          return -1;
        }

        const before = cx.char(pos - 1);
        const after = cx.char(pos + 2);
        const spaceBefore = isWhitespace(before);
        const spaceAfter = isWhitespace(after);

        return cx.addDelimiter(
          UNDERLINE_DELIMITER,
          pos,
          pos + 2,
          !spaceAfter && (!isPunctuation(after) || spaceBefore || isPunctuation(before)),
          !spaceBefore && (!isPunctuation(before) || spaceAfter || isPunctuation(after)),
        );
      },
    },
  ],
};
