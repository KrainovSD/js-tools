import type { LanguageDescription } from "@codemirror/language";
import type { Range } from "@codemirror/state";
import type { Decoration, EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";

export type InitMarkdownOptions = {
  languages?: LanguageDescription[];
  imageSrcGetter?: (src: string) => string;
};

export type GetDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
};

export type GetSelectionDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
  forceActive: boolean;
};

export type GetDecorationFunction = (options: GetDecorationOptions) => void;
export type GetSelectionDecorationFunction = (options: GetSelectionDecorationOptions) => void;

export type DecorationPlugin = {
  decorations?: GetDecorationFunction[];
  selectionDecorations?: GetSelectionDecorationFunction[];
};

export type MarkdownState = {
  imageSrcGetter?: (src: string) => string;
  openedImage: string | undefined;
  openedLink: string | undefined;
  uniqueId: string;
};

export type MarkdownStateConfig = {
  imageSrcGetter?: (src: string) => string;
};
