import type { MarkdownConfig } from "@lezer/markdown";
import { CODE_OF_HASHTAG, NAME_OF_HASHTAG } from "./hashtag-model";

function isHashtagCharCode(code: number) {
  return (
    (code >= 97 && code <= 122) || // a-z
    (code >= 65 && code <= 90) || // A-Z
    (code >= 48 && code <= 57) || // 0-9
    (code >= 0x410 && code <= 0x44f) || // А-я
    code === 0x401 || // Ё
    code === 0x451 || // ё
    code === 45 || // -
    code === 46 || // .
    code === 47 || // /
    code === 95 // _
  );
}

function isTrimmedCharCode(code: number) {
  return code === 45 || code === 46 || code === 47 || code === 95;
}

export const hashtagParser: MarkdownConfig = {
  defineNodes: [{ name: NAME_OF_HASHTAG }],
  parseInline: [
    {
      name: NAME_OF_HASHTAG,
      parse(cx, code, pos) {
        if (code != CODE_OF_HASHTAG) return -1;
        const prevCode = cx.char(pos - 1);
        if (prevCode !== -1 && (isHashtagCharCode(prevCode) || prevCode === CODE_OF_HASHTAG)) {
          return -1;
        }
        let end = pos + 1;
        while (end < cx.end && isHashtagCharCode(cx.char(end))) end++;
        while (end > pos + 1 && isTrimmedCharCode(cx.char(end - 1))) end--;
        if (end === pos + 1) return -1;
        return cx.addElement(cx.elt(NAME_OF_HASHTAG, pos, end));
      },
    },
  ],
};
