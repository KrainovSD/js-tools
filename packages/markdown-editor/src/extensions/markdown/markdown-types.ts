import type { Range } from "@codemirror/state";
import type { Decoration, EditorView } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";

export type InitMarkdownOptions = {};

export type GetDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
};

export type GetSelectionDecorationOptions = {
  node: SyntaxNodeRef;
  decorations: Range<Decoration>[];
  view: EditorView;
  isReadonly: boolean;
};

export type GetDecorationFunction = (options: GetDecorationOptions) => void;
export type GetSelectionDecorationFunction = (options: GetSelectionDecorationOptions) => void;

export type DecorationPlugin = {
  decorations?: GetDecorationFunction[];
  selectionDecorations?: GetSelectionDecorationFunction[];
};
