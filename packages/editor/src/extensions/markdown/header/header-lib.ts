import type { EditorState } from "@codemirror/state";
import type { SyntaxNodeRef } from "@lezer/common";
import {
  CODE_OF_CYRILLIC_END,
  CODE_OF_CYRILLIC_LOWER_IO,
  CODE_OF_CYRILLIC_START,
  CODE_OF_CYRILLIC_UPPER_END,
  CODE_OF_CYRILLIC_UPPER_IO,
  CODE_OF_CYRILLIC_UPPER_START,
  CODE_OF_DIGIT_END,
  CODE_OF_DIGIT_START,
  CODE_OF_HYPHEN,
  CODE_OF_LATIN_LOWER_END,
  CODE_OF_LATIN_LOWER_START,
  CODE_OF_LATIN_UPPER_END,
  CODE_OF_LATIN_UPPER_START,
  NAME_OF_HEADER,
  NAME_OF_HEADER_MARK,
  NAME_OF_HEADER_UNDER,
  isWhitespaceCode,
} from "../markdown-model";
import type { HeaderEntry } from "./header-model";

const CODES_CHUNK_LIMIT = 4096;

const codeBuffer: number[] = [];

function isLetterCode(code: number): boolean {
  return (
    (code >= CODE_OF_LATIN_UPPER_START && code <= CODE_OF_LATIN_UPPER_END) ||
    (code >= CODE_OF_LATIN_LOWER_START && code <= CODE_OF_LATIN_LOWER_END) ||
    (code >= CODE_OF_CYRILLIC_START && code <= CODE_OF_CYRILLIC_END) ||
    (code >= 0xc0 && code <= 0xff && code !== 0xd7 && code !== 0xf7) ||
    (code >= 0x100 && code <= 0x24f)
  );
}

function toLowerLetterCode(code: number): number {
  if (
    (code >= CODE_OF_LATIN_UPPER_START && code <= CODE_OF_LATIN_UPPER_END) ||
    (code >= CODE_OF_CYRILLIC_UPPER_START && code <= CODE_OF_CYRILLIC_UPPER_END)
  ) {
    return code + 32;
  }
  if (code === CODE_OF_CYRILLIC_UPPER_IO) return CODE_OF_CYRILLIC_LOWER_IO;
  if (code >= 0xc0 && code <= 0xde) return code + 32;
  return code;
}

export function getHeaderId(value: string): string {
  let result = "";
  let length = 0;
  let pendingHyphen = false;
  for (let pos = 0; pos < value.length; pos++) {
    const code = value.charCodeAt(pos);
    if (isWhitespaceCode(code) || code === CODE_OF_HYPHEN) {
      pendingHyphen = length > 0 || result.length > 0;
      continue;
    }
    const isLetter = isLetterCode(code);
    if (!isLetter && (code < CODE_OF_DIGIT_START || code > CODE_OF_DIGIT_END)) continue;
    if (pendingHyphen) {
      codeBuffer[length++] = CODE_OF_HYPHEN;
      pendingHyphen = false;
    }
    codeBuffer[length++] = isLetter ? toLowerLetterCode(code) : code;
    if (length === CODES_CHUNK_LIMIT) {
      codeBuffer.length = length;
      const chunk = String.fromCharCode(...codeBuffer);
      result = result ? result + chunk : chunk;
      length = 0;
    }
  }
  if (length > 0) {
    codeBuffer.length = length;
    const chunk = String.fromCharCode(...codeBuffer);
    result = result ? result + chunk : chunk;
  }
  return result;
}

export function parseHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry | undefined {
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) {
    return;
  }
  const slug = getHeaderId(state.doc.sliceString(mark.to, state.doc.lineAt(node.from).to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER.length)),
  };
}

export function parseSetextHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry {
  const textLine = state.doc.lineAt(node.from);
  const slug = getHeaderId(state.doc.sliceString(textLine.from, textLine.to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER_UNDER.length)),
  };
}
