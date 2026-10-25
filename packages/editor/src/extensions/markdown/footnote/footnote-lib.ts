import {
  CODE_OF_FOOTNOTE_CARET,
  CODE_OF_FOOTNOTE_COLON,
  CODE_OF_FOOTNOTE_END,
  CODE_OF_FOOTNOTE_START,
  CODE_OF_LINE_BREAK,
} from "./footnote-model";

export function isFootnoteDefinitionStart(content: string, start: number = 0): boolean {
  if (content.charCodeAt(start) !== CODE_OF_FOOTNOTE_START) return false;
  if (content.charCodeAt(start + 1) !== CODE_OF_FOOTNOTE_CARET) return false;

  let pos = start + 2;
  while (pos < content.length) {
    const code = content.charCodeAt(pos);
    if (code === CODE_OF_FOOTNOTE_END) break;
    if (code === CODE_OF_FOOTNOTE_START || code === CODE_OF_LINE_BREAK) return false;
    pos++;
  }

  return (
    pos > start + 2 &&
    content.charCodeAt(pos) === CODE_OF_FOOTNOTE_END &&
    content.charCodeAt(pos + 1) === CODE_OF_FOOTNOTE_COLON
  );
}
