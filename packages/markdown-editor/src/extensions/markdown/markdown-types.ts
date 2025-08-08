import type { LanguageDescription } from "@codemirror/language";
import type { Range } from "@codemirror/state";
import type { Decoration, EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";

export type EditorLanguages = LanguageDescription;

export type InitMarkdownOptions = {
  languages?: EditorLanguages[];
  imageSrcGetter?: (src: string) => string;
};

export type GetDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
  settings: MarkdownDecorationSettings;
};

export type GetSelectionDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
  forceActive: boolean;
  settings: MarkdownDecorationSettings;
};

export type GetDecorationFunction = (options: GetDecorationOptions) => void;
export type GetSelectionDecorationFunction = (options: GetSelectionDecorationOptions) => void;

export type DecorationPlugin = {
  decorations?: GetDecorationFunction[];
  selectionDecorations?: GetSelectionDecorationFunction[];
};

export type MarkdownState = {
  openedImage: string | undefined;
  openedLink: string | undefined;
  uniqueId: string;
};

export type MarkdownDecorationSettings = {
  imageSrcGetter?: (src: string) => string;
};
