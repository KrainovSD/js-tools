import { foldState, foldable, syntaxTree } from "@codemirror/language";
import type { Extension, Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { isFoldedFrom, isHeadingNodeName } from "./fold-lib";
import { FoldIndicatorWidget } from "./fold-widget";

export function NewFoldIndicators(): Extension {
  return ViewPlugin.fromClass(
    class FoldIndicatorsView {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildIndicators(view);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          syntaxTree(update.startState) !== syntaxTree(update.state) ||
          update.startState.field(foldState, false) !== update.state.field(foldState, false)
        ) {
          this.decorations = buildIndicators(update.view);
        }
      }
    },
    { decorations: (view) => view.decorations },
  );
}

function buildIndicators(view: EditorView): DecorationSet {
  const { state } = view;
  const doc = state.doc;
  const decorations: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        if (!isHeadingNodeName(node.name)) return;
        const anchorLine = doc.lineAt(node.from);
        const lineFrom = doc.lineAt(node.from).from;
        const last = decorations[decorations.length - 1];
        if (foldable(state, anchorLine.from, anchorLine.to) && last?.from !== lineFrom) {
          decorations.push(
            Decoration.widget({
              widget: new FoldIndicatorWidget(isFoldedFrom(state, anchorLine.to)),
              side: -1,
            }).range(lineFrom),
          );
        }
        return false;
      },
    });
  }
  return decorations.length ? Decoration.set(decorations, true) : Decoration.none;
}
