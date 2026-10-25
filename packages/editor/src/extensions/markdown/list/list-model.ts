import {
  CODE_OF_ASTERISK,
  CODE_OF_CLOSE_PAREN,
  CODE_OF_DOT,
  CODE_OF_HYPHEN,
  CODE_OF_PLUS,
} from "../markdown-model";

export const LIST_OF_LIST_MARKS = new Set([CODE_OF_ASTERISK, CODE_OF_PLUS, CODE_OF_HYPHEN]); // * + -
export const LIST_OF_ORDERED_LIST_MARKS = new Set([CODE_OF_DOT, CODE_OF_CLOSE_PAREN]); // . )
