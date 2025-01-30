import { utils } from "@/lib";
import type { DecorationPlugin, GetSelectionDecorationOptions } from "../markdown-types";
import { NAME_OF_AUTO_LINK } from "./link-constants";
import { LinkWidget } from "./link-widget";

function getAutoLinkSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_AUTO_LINK) return;

  const url = view.state.doc.sliceString(node.from + 1, node.to - 1);

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.to],
        widget: new LinkWidget(url, url, "auto"),
      }),
    );
  }
}

export const autoLinkDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getAutoLinkSelectionDecorations],
};
