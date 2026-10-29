import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import { CODE_OF_COLON, type SelectionDecorationOptions } from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import { parseLink } from "./link-lib";
import { LinkWidget } from "./link-widget";

export function fillLinkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const entry = parseLink(view.state, node);
  if (!entry.url) {
    return void fillLinkLabelSelectionDecorations(opts);
  }
  const uniqueId = view.state.field(MarkdownState).uniqueId;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(entry.text, entry.url, node.from, node.to, uniqueId, view, false),
      }).range(node.from, node.to),
    );
  }
}

export function fillShortLinkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const text = view.state.doc.sliceString(node.from + 2, node.to - 2);
  const url = text;
  const uniqueId = view.state.field(MarkdownState).uniqueId;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(text, url, node.from, node.to, uniqueId, view, true),
      }).range(node.from, node.to),
    );
  }
}

function fillLinkLabelSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (view.state.doc.sliceString(node.to, node.to + 1).charCodeAt(0) !== CODE_OF_COLON) return;

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to + 1])
  ) {
    decorations.push(
      Decoration.mark({
        class: CLASSES.linkLabel,
      }).range(node.from, node.to + 1),
    );
    decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
    decorations.push(Decoration.replace({}).range(node.to - 1, node.to + 1));
  }
}
