import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { blockquoteDecorationPlugin } from "./blockquote";
import { boldDecorationPlugin } from "./bold";
import { codeDecorationPlugin } from "./code";
import { headerDecorationPlugin } from "./header";
import { horizontalDecorationPlugin } from "./horizontal";
import { imageDecorationPlugin } from "./image/image-decoration";
import { italicDecorationPlugin } from "./italic";
import { autoLinkDecorationPlugin, linkDecorationPlugin } from "./link";
import { listDecorationPlugin } from "./list";
import type { DecorationMap, DecorationPlugin, SelectionDecorationMap } from "./markdown-types";
import { mentionDecorationPlugin } from "./mention/mention-decoration";
import { strikeThroughDecorationPlugin } from "./strike-through";
import { todoDecorationPlugin } from "./todo";

const decorationPlugins: DecorationPlugin[] = [
  blockquoteDecorationPlugin,
  boldDecorationPlugin,
  codeDecorationPlugin,
  headerDecorationPlugin,
  horizontalDecorationPlugin,
  imageDecorationPlugin,
  italicDecorationPlugin,
  linkDecorationPlugin,
  listDecorationPlugin,
  autoLinkDecorationPlugin,
  mentionDecorationPlugin,
  strikeThroughDecorationPlugin,
  todoDecorationPlugin,
];

let decorationsMap: DecorationMap = {};
let selectionDecorationMap: SelectionDecorationMap = {};

for (const plugin of decorationPlugins) {
  if (plugin.decorations) decorationsMap = { ...decorationsMap, ...plugin.decorations };
  if (plugin.selectionDecorations)
    selectionDecorationMap = { ...selectionDecorationMap, ...plugin.selectionDecorations };
}

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
  "TaskMarker",
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
        /** Decoration by change content */
        if (isChanged) {
          const decorationF = decorationsMap[node.name];
          if (decorationF) {
            if (typeof decorationF === "function") decorationF({ decorations, node, view });
            else decorationF.forEach((f) => f({ decorations, node, view }));
          }
        }

        /** Decoration by selection content  */
        {
          const selectionDecorationF = selectionDecorationMap[node.name];
          if (selectionDecorationF) {
            if (typeof selectionDecorationF === "function")
              selectionDecorationF({ decorations: selectionDecorations, node, view, isReadonly });
            else
              selectionDecorationF.forEach((f) =>
                f({ decorations: selectionDecorations, node, view, isReadonly }),
              );
          }
        }
      },
    });
  }

  if (isChanged) {
    markdownDecorations = decorations;
  }

  return Decoration.set([...decorations, ...selectionDecorations], true);
}

export const markdownDecorationPlugin = ViewPlugin.fromClass(
  class DecorationMarkdown {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = getDecorations(view, true);
    }

    update(update: ViewUpdate) {
      console.time("decoration");
      const isDocumentChanged =
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) != syntaxTree(update.state);
      this.decorations = getDecorations(update.view, isDocumentChanged);
      console.timeEnd("decoration");
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);
