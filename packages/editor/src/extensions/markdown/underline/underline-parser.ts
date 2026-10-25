import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_OF_CARET,
  NAME_OF_UNDERLINE,
  NAME_OF_UNDERLINE_MARK,
  isWhitespaceCode,
} from "../markdown-model";

const UNDERLINE_DELIMITER = {
  resolve: NAME_OF_UNDERLINE,
  mark: NAME_OF_UNDERLINE_MARK,
};

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
  defineNodes: [{ name: NAME_OF_UNDERLINE }, { name: NAME_OF_UNDERLINE_MARK }],
  parseInline: [
    {
      name: NAME_OF_UNDERLINE,
      before: "Superscript",
      parse(cx, code, pos) {
        if (
          code !== CODE_OF_CARET ||
          cx.char(pos + 1) !== CODE_OF_CARET ||
          cx.char(pos + 2) === CODE_OF_CARET
        ) {
          return -1;
        }

        const before = cx.char(pos - 1);
        const after = cx.char(pos + 2);
        const spaceBefore = isWhitespaceCode(before);
        const spaceAfter = isWhitespaceCode(after);

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
