const CODE_OF_HYPHEN = 45; // -
const CODE_OF_DIGIT_START = 48; // 0
const CODE_OF_DIGIT_END = 57; // 9
const CODES_CHUNK_LIMIT = 4096;

const codeBuffer: number[] = [];

function isLetterCode(code: number): boolean {
  return (
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122) || // a-z
    (code >= 0x400 && code <= 0x4ff) ||
    (code >= 0xc0 && code <= 0xff && code !== 0xd7 && code !== 0xf7) ||
    (code >= 0x100 && code <= 0x24f)
  );
}

function toLowerLetterCode(code: number): number {
  if ((code >= 65 && code <= 90) || (code >= 0x410 && code <= 0x42f)) return code + 32; // A-Z, А-Я
  if (code === 0x401) return 0x451; // Ё → ё
  if (code >= 0xc0 && code <= 0xde) return code + 32; // À-Þ → à-þ
  return code;
}

function isWhitespaceCode(code: number): boolean {
  return (
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
