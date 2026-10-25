import type { MarkdownConfig } from "@lezer/markdown";
import {
  CODE_OF_AT,
  CODE_OF_CYRILLIC_LOWER_END,
  CODE_OF_CYRILLIC_LOWER_IO,
  CODE_OF_CYRILLIC_UPPER_IO,
  CODE_OF_CYRILLIC_UPPER_START,
  CODE_OF_DIGIT_END,
  CODE_OF_DIGIT_START,
  CODE_OF_DOT,
  CODE_OF_HYPHEN,
  CODE_OF_LATIN_LOWER_END,
  CODE_OF_LATIN_LOWER_START,
  CODE_OF_LATIN_UPPER_END,
  CODE_OF_LATIN_UPPER_START,
  CODE_OF_SLASH,
  CODE_OF_UNDERSCORE,
  NAME_OF_MENTION,
} from "../markdown-model";

function isMentionCharCode(code: number) {
  return (
    (code >= CODE_OF_LATIN_LOWER_START && code <= CODE_OF_LATIN_LOWER_END) ||
    (code >= CODE_OF_LATIN_UPPER_START && code <= CODE_OF_LATIN_UPPER_END) ||
    (code >= CODE_OF_DIGIT_START && code <= CODE_OF_DIGIT_END) ||
    (code >= CODE_OF_CYRILLIC_UPPER_START && code <= CODE_OF_CYRILLIC_LOWER_END) ||
    code === CODE_OF_CYRILLIC_UPPER_IO ||
    code === CODE_OF_CYRILLIC_LOWER_IO ||
    code === CODE_OF_HYPHEN ||
    code === CODE_OF_DOT ||
    code === CODE_OF_UNDERSCORE
  );
}

function isTrimmedCharCode(code: number) {
  return code === CODE_OF_HYPHEN || code === CODE_OF_DOT || code === CODE_OF_UNDERSCORE;
}

export const mentionParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_MENTION }],
  parseInline: [
    {
      name: NAME_OF_MENTION,
      parse(cx, code, pos) {
        if (code != CODE_OF_AT) return -1;
        const prevCode = cx.char(pos - 1);
        if (
          prevCode !== -1 &&
          (isMentionCharCode(prevCode) || prevCode === CODE_OF_AT || prevCode === CODE_OF_SLASH)
        ) {
          return -1;
        }
        let end = pos + 1;
        while (end < cx.end && isMentionCharCode(cx.char(end))) end++;
        while (end > pos + 1 && isTrimmedCharCode(cx.char(end - 1))) end--;
        if (end === pos + 1) return -1;
        return cx.addElement(cx.elt(NAME_OF_MENTION, pos, end));
      },
    },
  ],
};
