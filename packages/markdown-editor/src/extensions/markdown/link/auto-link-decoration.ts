import { utils } from "@/lib";
import { markdownState } from "../markdown-state";
import type { DecorationPlugin, GetSelectionDecorationOptions } from "../markdown-types";
import { NAME_OF_AUTO_LINK } from "./link-constants";
import { LinkWidget } from "./link-widget";

function getAutoLinkSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_AUTO_LINK) return;

  const url = view.state.doc.sliceString(node.from + 1, node.to - 1);
  const openedLink = view.state.field(markdownState).openedLink;
  const key = `${url}:${url}:${node.from}:${node.to}`;
  const isOpened = openedLink && openedLink === key;

  if (isOpened) {
    return void decorations.push(
      utils.getMarkDecoration({
        range: [node.from, node.to],
        attributes: {
          "data-id": key,
        },
      }),
    );
  }

  if (
    forceActive ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.to],
        widget: new LinkWidget(url, url, node.from, node.to, view),
      }),
    );
  } else {
    decorations.push(
      utils.getMarkDecoration({
        range: [node.from, node.to],
        attributes: {
          "data-id": key,
        },
      }),
    );
  }
}

export const autoLinkDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getAutoLinkSelectionDecorations],
};
