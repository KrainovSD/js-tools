import type { MarkdownConfig } from "@lezer/markdown";
import { isWhitespaceCode } from "../markdown-lib";
import { CODE_OF_EQUALS, NAME_OF_HIGHLIGHT, NAME_OF_HIGHLIGHT_MARK } from "../markdown-model";

const HIGHLIGHT_DELIMITER = {
  resolve: NAME_OF_HIGHLIGHT,
  mark: NAME_OF_HIGHLIGHT_MARK,
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

export const highlightParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_HIGHLIGHT }, { name: NAME_OF_HIGHLIGHT_MARK }],
  parseInline: [
    {
      name: NAME_OF_HIGHLIGHT,
      before: "Superscript",
      parse(cx, code, pos) {
        if (
          code !== CODE_OF_EQUALS ||
          cx.char(pos + 1) !== CODE_OF_EQUALS ||
          cx.char(pos + 2) === CODE_OF_EQUALS ||
          cx.char(pos - 1) === CODE_OF_EQUALS
        ) {
          return -1;
        }

        const before = cx.char(pos - 1);
        const after = cx.char(pos + 2);
        const spaceBefore = isWhitespaceCode(before);
        const spaceAfter = isWhitespaceCode(after);

        return cx.addDelimiter(
          HIGHLIGHT_DELIMITER,
          pos,
          pos + 2,
          !spaceAfter && (!isPunctuation(after) || spaceBefore || isPunctuation(before)),
          !spaceBefore && (!isPunctuation(before) || spaceAfter || isPunctuation(after)),
        );
      },
    },
  ],
};
