import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { getBoldDecorations, getBoldHideDecorations } from "./bold";
import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHeaderDecorations, getHeaderHideDecorations } from "./header";
import { getItalicDecorations, getItalicHideDecorations } from "./italic";

const decorationFunctions: ((options: GetDecorationsOptions) => void)[] = [
  getHeaderDecorations,
  getBoldDecorations,
  getItalicDecorations,
];
const hideDecorationFunctions: ((options: GetDecorationsOptions) => void)[] = [
  getHeaderHideDecorations,
  getBoldHideDecorations,
  getItalicHideDecorations,
];
const BAD_MARKS = new Set(["Document", "Paragraph", "EmphasisMark"]);

let markdownDecorations: Range<Decoration>[] = [];

function getDecorations(view: EditorView, isChanged: boolean) {
  const decorations: Range<Decoration>[] = isChanged ? [] : markdownDecorations;
  const hiddenDecorations: Range<Decoration>[] = [];
  const contentEditable = view.contentDOM.getAttribute("contenteditable");
  const isReadonly = !contentEditable || contentEditable === "false";

  for (const { from: fromVisible, to: toVisible } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from: fromVisible,
      to: toVisible,
      enter: (node) => {
        if (BAD_MARKS.has(node.name)) return;

        // console.log(node.name, view.state.doc.sliceString(node.from, node.to));

        if (isChanged) {
          decorationFunctions.forEach((f) => f({ decorations, node, view }));
        }
        if (!isReadonly)
          hideDecorationFunctions.forEach((f) => f({ decorations: hiddenDecorations, node, view }));
      },
    });
  }

  if (isChanged) {
    markdownDecorations = decorations;
  }

  return Decoration.set([...decorations, ...hiddenDecorations], true);
}

export const decorationMarkdownPlugin = ViewPlugin.fromClass(
  class DecorationMarkdown {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = getDecorations(view, true);
    }

    update(update: ViewUpdate) {
      const isDocumentChanged =
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) != syntaxTree(update.state);
      this.decorations = getDecorations(update.view, isDocumentChanged);
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);
