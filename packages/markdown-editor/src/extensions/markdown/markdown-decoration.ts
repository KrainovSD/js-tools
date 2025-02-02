import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import { blockquoteDecorationPlugin } from "./blockquote";
import { boldDecorationPlugin } from "./bold";
import { codeDecorationPlugin } from "./code";
import { headerDecorationPlugin } from "./header";
import { horizontalDecorationPlugin } from "./horizontal";
import { imageDecorationPlugin } from "./image/image-decoration";
import { italicDecorationPlugin } from "./italic";
import { autoLinkDecorationPlugin, linkDecorationPlugin } from "./link";
import { listDecorationPlugin } from "./list";
import type {
  DecorationPlugin,
  GetDecorationFunction,
  GetSelectionDecorationFunction,
} from "./markdown-types";
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

let decorationFunctions: GetDecorationFunction[] = [];
let selectionDecorationFunctions: GetSelectionDecorationFunction[] = [];

for (const plugin of decorationPlugins) {
  if (plugin.decorations) decorationFunctions = decorationFunctions.concat(plugin.decorations);
  if (plugin.selectionDecorations)
    selectionDecorationFunctions = selectionDecorationFunctions.concat(plugin.selectionDecorations);
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

function createDecorationsGetter() {
  let markdownDecorationsCache: Range<Decoration>[] = [];
  let markdownSelectionDecorationsCache: Range<Decoration>[] = [];

  function getDecorations(view: EditorView, isChanged: boolean, mouseReleased: boolean) {
    const processDecorations = isChanged;
    const processSelectionDecorations = mouseReleased;
    const decorations: Range<Decoration>[] = processDecorations ? [] : markdownDecorationsCache;
    const selectionDecorations: Range<Decoration>[] = processSelectionDecorations
      ? []
      : markdownSelectionDecorationsCache;

    const contentEditable = view.contentDOM.getAttribute("contenteditable");
    const isReadonly = !contentEditable || contentEditable === "false";

    for (const { from: fromVisible, to: toVisible } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from: fromVisible,
        to: toVisible,
        enter: (node) => {
          if (SKIP_MARKS.has(node.name)) return;
          /** Decoration by change content */
          if (processDecorations)
            decorationFunctions.forEach((f) => f({ decorations, node, view }));

          /** Decoration by selection content  */
          if (processSelectionDecorations)
            selectionDecorationFunctions.forEach((f) =>
              f({
                decorations: selectionDecorations,
                node,
                view,
                forceActive: isReadonly,
              }),
            );
        },
      });
    }

    if (processDecorations) {
      markdownDecorationsCache = decorations;
    }
    if (processSelectionDecorations) {
      markdownSelectionDecorationsCache = selectionDecorations;
    }

    return Decoration.set([...decorations, ...selectionDecorations], true);
  }

  return getDecorations;
}

export const markdownDecorationPlugin = ViewPlugin.fromClass(
  class DecorationMarkdown {
    decorations: DecorationSet;

    mouseReleased: boolean = true;

    dom: HTMLElement;

    view: EditorView;

    decorationGetter: (
      view: EditorView,
      isChanged: boolean,
      mouseReleased: boolean,
    ) => DecorationSet;

    constructor(view: EditorView) {
      this.decorationGetter = createDecorationsGetter();
      this.decorations = this.decorationGetter(view, true, this.mouseReleased);
      this.dom = view.dom;
      this.view = view;
      document.addEventListener("mousedown", this.onMouseDown.bind(this));
      document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    update(update: ViewUpdate) {
      const isDocumentChanged =
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) != syntaxTree(update.state);
      this.decorations = this.decorationGetter(update.view, isDocumentChanged, this.mouseReleased);
    }

    destroy() {
      document.removeEventListener("mousedown", this.onMouseDown.bind(this));
      document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onMouseDown(this: DecorationMarkdown) {
      this.mouseReleased = false;
    }

    onMouseUp(this: DecorationMarkdown) {
      this.mouseReleased = true;
      if (this.view.state.selection.ranges[0].from !== this.view.state.selection.ranges[0].to) {
        saveDispatch(() => {
          this.view.dispatch(this.view.state.update({}));
        });
      }
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);
