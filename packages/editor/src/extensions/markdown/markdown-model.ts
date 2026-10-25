import type { LanguageDescription } from "@codemirror/language";
import type { EditorState, Range } from "@codemirror/state";
import type { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import type Viewer from "viewerjs";
import type { HeaderEntry } from "./header/header-model";
import type { ImageEntry } from "./image/image-model";
import type { TableModel } from "./table/table-model";

export const CODE_OF_TAB = 9; // \t
export const CODE_OF_LINE_BREAK = 10; // \n
export const CODE_OF_CARRIAGE_RETURN = 13; // \r
export const CODE_OF_SPACE = 32; // space

export const CODE_OF_EXCLAMATION = 33; // !
export const CODE_OF_DOUBLE_QUOTE = 34; // "
export const CODE_OF_HASH = 35; // #
export const CODE_OF_DOLLAR = 36; // $
export const CODE_OF_PERCENT = 37; // %
export const CODE_OF_AMPERSAND = 38; // &
export const CODE_OF_APOSTROPHE = 39; // '
export const CODE_OF_OPEN_PAREN = 40; // (
export const CODE_OF_CLOSE_PAREN = 41; // )
export const CODE_OF_ASTERISK = 42; // *
export const CODE_OF_PLUS = 43; // +
export const CODE_OF_COMMA = 44; // ,
export const CODE_OF_HYPHEN = 45; // -
export const CODE_OF_DOT = 46; // .
export const CODE_OF_SLASH = 47; // /
export const CODE_OF_COLON = 58; // :
export const CODE_OF_SEMICOLON = 59; // ;
export const CODE_OF_LESS_THAN = 60; // <
export const CODE_OF_EQUALS = 61; // =
export const CODE_OF_GREATER_THAN = 62; // >
export const CODE_OF_QUESTION = 63; // ?
export const CODE_OF_AT = 64; // @
export const CODE_OF_OPEN_BRACKET = 91; // [
export const CODE_OF_BACKSLASH = 92; // \
export const CODE_OF_CLOSE_BRACKET = 93; // ]
export const CODE_OF_CARET = 94; // ^
export const CODE_OF_UNDERSCORE = 95; // _
export const CODE_OF_BACKTICK = 96; // `
export const CODE_OF_OPEN_BRACE = 123; // {
export const CODE_OF_PIPE = 124; // |
export const CODE_OF_CLOSE_BRACE = 125; // }
export const CODE_OF_TILDE = 126; // ~

export const CODE_OF_DIGIT_START = 48; // 0
export const CODE_OF_DIGIT_END = 57; // 9

export const CODE_OF_LATIN_UPPER_START = 65; // A
export const CODE_OF_LATIN_UPPER_END = 90; // Z
export const CODE_OF_LATIN_LOWER_START = 97; // a
export const CODE_OF_LATIN_LOWER_END = 122; // z

export const CODE_OF_LATIN_B = 98; // b
export const CODE_OF_LATIN_R = 114; // r
export const CODE_OF_LATIN_X = 120; // x

export const CODE_OF_CYRILLIC_START = 0x400; // Ѐ
export const CODE_OF_CYRILLIC_END = 0x4ff; // ӿ
export const CODE_OF_CYRILLIC_UPPER_START = 0x410; // А
export const CODE_OF_CYRILLIC_UPPER_END = 0x42f; // Я
export const CODE_OF_CYRILLIC_LOWER_START = 0x430; // а
export const CODE_OF_CYRILLIC_LOWER_END = 0x44f; // я
export const CODE_OF_CYRILLIC_UPPER_IO = 0x401; // Ё
export const CODE_OF_CYRILLIC_LOWER_IO = 0x451; // ё
export const CODE_OF_CYRILLIC_HA = 0x445; // х

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

export const NAME_OF_HEADER = "ATXHeading";
export const NAME_OF_HEADER_UNDER = "SetextHeading";
export const NAME_OF_HEADER_MARK = "HeaderMark";
export const NAME_OF_BOLD = "StrongEmphasis";
export const NAME_OF_ITALIC = "Emphasis";
export const NAME_OF_EMPHASIS_MARK = "EmphasisMark";
export const NAME_OF_STRIKE_THROUGH = "Strikethrough";
export const NAME_OF_STRIKE_THROUGH_MARK = "StrikethroughMark";
export const NAME_OF_UNDERLINE = "Underline";
export const NAME_OF_UNDERLINE_MARK = "UnderlineMark";
export const NAME_OF_HIGHLIGHT = "Highlight";
export const NAME_OF_HIGHLIGHT_MARK = "HighlightMark";
export const NAME_OF_INLINE_CODE = "InlineCode";
export const NAME_OF_FENCED_CODE = "FencedCode";
export const NAME_OF_CODE_BLOCK = "CodeBlock";
export const NAME_OF_CODE_MARK = "CodeMark";
export const NAME_OF_CODE_INFO = "CodeInfo";
export const NAME_OF_CODE_TEXT = "CodeText";
export const NAME_OF_IMAGE = "Image";
export const NAME_OF_LINK = "Link";
export const NAME_OF_LINK_MARK = "LinkMark";
export const NAME_OF_AUTO_LINK = "Autolink";
export const NAME_OF_URL = "URL";
export const NAME_OF_SHORT_LINK = "ShortLink";
export const NAME_OF_SHORT_LINK_MARK = "ShortLinkMark";
export const NAME_OF_HASHTAG = "Hashtag";
export const NAME_OF_MENTION = "Mention";
export const NAME_OF_HORIZONTAL_RULE = "HorizontalRule";
export const NAME_OF_BLOCKQUOTE = "Blockquote";
export const NAME_OF_QUOTE_MARK = "QuoteMark";
export const NAME_OF_LIST_MARK = "ListMark";
export const NAME_OF_TODO = "Task";
export const NAME_OF_TABLE = "Table";
export const NAME_OF_TABLE_HEADER = "TableHeader";
export const NAME_OF_TABLE_ROW = "TableRow";
export const NAME_OF_TABLE_CELL = "TableCell";
export const NAME_OF_TABLE_DELIMITER = "TableDelimiter";
export const NAME_OF_FOOTNOTE_REF = "FootnoteRef";
export const NAME_OF_FOOTNOTE_DEFINITION = "FootnoteDefinition";
export const NAME_OF_ESCAPE = "Escape";
export const NAME_OF_HTML_TAG = "HTMLTag";

export type EditorLanguages = LanguageDescription;
export type MarkdownOptions = {
  name?: "markdown";
  languages?: EditorLanguages[];
} & Omit<MarkdownDecorationSettings, "openImageFullscreen">;

export type TreeIndex = {
  tables: TableModel[];
  images: ImageEntry[];
  headers: HeaderEntry[];
  headersByFrom: Map<number, HeaderEntry>;
  imagesByFrom: Map<number, ImageEntry>;
};

export type StateDecorationOptions = {
  state: EditorState;
  focused: boolean;
  decorations: Range<Decoration>[];
};

export type ContentDecorationOptions = {
  view: EditorView;
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  settings: MarkdownDecorationSettings;
};

export type SelectionDecorationOptions = {
  view: EditorView;
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  readonly: boolean;
  settings: MarkdownDecorationSettings;
};

export type MarkdownStateType = {
  uniqueId: string;
  focused: boolean;
  decorations: DecorationSet;
  getHeaders: (state: EditorState, ensure?: boolean) => HeaderEntry[];
  getImages: (state: EditorState, ensure?: boolean) => ImageEntry[];
  getTables: (state: EditorState, ensure?: boolean) => TableModel[];
  getHeaderAt: (state: EditorState, from: number) => HeaderEntry | undefined;
  getImageAt: (state: EditorState, from: number) => ImageEntry | undefined;
};

export type MarkdownDecorationSettings = {
  imageSrcGetter?: (src: string) => string;
  imageFullscreen?: boolean;
  imageFullscreenRoot?: HTMLElement;
  imageTransition?: boolean | Viewer.TransitionOptions;
  imagePreviewSize?: number;
  openImageFullscreen?: (view: EditorView, from: number) => Promise<void>;
};
