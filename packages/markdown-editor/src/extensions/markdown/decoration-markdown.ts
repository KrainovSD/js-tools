import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { getBlockquoteDecorations, getBlockquoteSelectionDecorations } from "./blockquote";
import { getBoldDecorations, getBoldSelectionDecorations } from "./bold";
import { getCodeSelectionDecorations } from "./code";
import { getHeaderDecorations, getHeaderSelectionDecorations } from "./header";
import { getHorizontalSelectionDecoration } from "./horizontal";
import { getImageSelectionDecorations } from "./image/image";
import { getItalicDecorations, getItalicSelectionDecorations } from "./italic";
import { getAutoLinkSelectionDecorations, getLinkSelectionDecorations } from "./link";
import { getListSelectionDecorations } from "./list";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "./markdown-types";
import {
  getStrikeThroughDecorations,
  getStrikeThroughSelectionDecorations,
} from "./strike-through";

const decorationFunctions: ((options: GetDecorationOptions) => void)[] = [
  getHeaderDecorations,
  getBoldDecorations,
  getItalicDecorations,
  getBlockquoteDecorations,
  getStrikeThroughDecorations,
];
const selectionDecorationFunctions: ((options: GetSelectionDecorationOptions) => void)[] = [
  getHeaderSelectionDecorations,
  getBoldSelectionDecorations,
  getItalicSelectionDecorations,
  getBlockquoteSelectionDecorations,
  getStrikeThroughSelectionDecorations,
  getListSelectionDecorations,
  getLinkSelectionDecorations,
  getCodeSelectionDecorations,
  getHorizontalSelectionDecoration,
  getImageSelectionDecorations,
  getAutoLinkSelectionDecorations,
];
const SKIP_MARKS = new Set([
  "Document",
  "Paragraph",
  "EmphasisMark",
  "Blockquote",
  "StrikethroughMark",
  "BulletList",
  "OrderedList",
  "ListItem",
  "LinkMark",
  "URL",
  "CodeMark",
  "CodeInfo",
  "CodeText",
  "HeaderMark",
]);

let markdownDecorations: Range<Decoration>[] = [];

function getDecorations(view: EditorView, isChanged: boolean) {
  const decorations: Range<Decoration>[] = isChanged ? [] : markdownDecorations;
  const selectionDecorations: Range<Decoration>[] = [];
  const contentEditable = view.contentDOM.getAttribute("contenteditable");
  const isReadonly = !contentEditable || contentEditable === "false";

  for (const { from: fromVisible, to: toVisible } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from: fromVisible,
      to: toVisible,
      enter: (node) => {
        if (SKIP_MARKS.has(node.name)) return;

        console.log(node.name, view.state.doc.sliceString(node.from, node.to));

        /** Decoration by change content */
        if (isChanged) {
          decorationFunctions.forEach((f) => f({ decorations, node, view }));
        }

        /** Decoration by selection content  */
        selectionDecorationFunctions.forEach((f) =>
          f({ decorations: selectionDecorations, node, view, isReadonly }),
        );
      },
    });
  }

  if (isChanged) {
    markdownDecorations = decorations;
  }

  return Decoration.set([...decorations, ...selectionDecorations], true);
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
