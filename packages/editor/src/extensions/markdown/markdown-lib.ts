import {
  CODE_OF_CARRIAGE_RETURN,
  CODE_OF_CYRILLIC_END,
  CODE_OF_CYRILLIC_LOWER_IO,
  CODE_OF_CYRILLIC_START,
  CODE_OF_CYRILLIC_UPPER_END,
  CODE_OF_CYRILLIC_UPPER_IO,
  CODE_OF_CYRILLIC_UPPER_START,
  CODE_OF_LATIN_LOWER_END,
  CODE_OF_LATIN_LOWER_START,
  CODE_OF_LATIN_UPPER_END,
  CODE_OF_LATIN_UPPER_START,
  CODE_OF_SPACE,
  CODE_OF_TAB,
} from "./markdown-model";

export function isWhitespaceCode(code: number): boolean {
  return (
    code === -1 ||
    Number.isNaN(code) ||
    code === CODE_OF_SPACE ||
    (code >= CODE_OF_TAB && code <= CODE_OF_CARRIAGE_RETURN) ||
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

export function isLetterCode(code: number): boolean {
  return (
    (code >= CODE_OF_LATIN_UPPER_START && code <= CODE_OF_LATIN_UPPER_END) ||
    (code >= CODE_OF_LATIN_LOWER_START && code <= CODE_OF_LATIN_LOWER_END) ||
    (code >= CODE_OF_CYRILLIC_START && code <= CODE_OF_CYRILLIC_END) ||
    (code >= 0xc0 && code <= 0xff && code !== 0xd7 && code !== 0xf7) ||
    (code >= 0x100 && code <= 0x24f)
  );
}

export function toLowerLetterCode(code: number): number {
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
