import {
  CODE_OF_CARET,
  CODE_OF_CLOSE_BRACKET,
  CODE_OF_COLON,
  CODE_OF_LINE_BREAK,
  CODE_OF_OPEN_BRACKET,
} from "../markdown-model";

export function isFootnoteDefinitionStart(content: string, start: number = 0): boolean {
  if (content.charCodeAt(start) !== CODE_OF_OPEN_BRACKET) return false;
  if (content.charCodeAt(start + 1) !== CODE_OF_CARET) return false;

  let pos = start + 2;
  while (pos < content.length) {
    const code = content.charCodeAt(pos);
    if (code === CODE_OF_CLOSE_BRACKET) break;
    if (code === CODE_OF_OPEN_BRACKET || code === CODE_OF_LINE_BREAK) return false;
    pos++;
  }

  return (
    pos > start + 2 &&
    content.charCodeAt(pos) === CODE_OF_CLOSE_BRACKET &&
    content.charCodeAt(pos + 1) === CODE_OF_COLON
  );
}
