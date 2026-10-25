import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  type ContentDecorationOptions,
  NAME_OF_AUTO_LINK,
  NAME_OF_IMAGE,
  NAME_OF_LINK,
  NAME_OF_SHORT_LINK,
  type SelectionDecorationOptions,
} from "../markdown-model";
import { MarkdownState } from "../markdown-state";
import { LinkWidget } from "./link-widget";

export function fillURLContentDecorations(opts: ContentDecorationOptions) {
  opts.decorations.push(
    Decoration.mark({
      class: CLASSES.link,
    }).range(opts.node.from, opts.node.to),
  );
}

export function fillURLSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const parent = node.node.parent?.name;
  if (
    parent === NAME_OF_LINK ||
    parent === NAME_OF_IMAGE ||
    parent === NAME_OF_AUTO_LINK ||
    parent === NAME_OF_SHORT_LINK
  )
    return;

  const url = view.state.doc.sliceString(node.from, node.to);
  const uniqueId = view.state.field(MarkdownState).uniqueId;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(url, url, node.from, node.to, uniqueId, view),
      }).range(node.from, node.to),
    );
  }
}

export function fillAutolinkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const url = view.state.doc.sliceString(node.from + 1, node.to - 1);
  const uniqueId = view.state.field(MarkdownState).uniqueId;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new LinkWidget(url, url, node.from, node.to, uniqueId, view),
      }).range(node.from, node.to),
    );
  }
}
