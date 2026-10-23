import type { LanguageDescription } from "@codemirror/language";
import type { EditorState, Range } from "@codemirror/state";
import type { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import type Viewer from "viewerjs";
import type { HeaderEntry } from "./header";
import type { ImageEntry } from "./image";
import type { TableModel } from "./table";

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
