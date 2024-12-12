import { utils } from "@/lib";
import { type GetSelectionDecorationOptions } from "../markdown-types";
import { LinkWidget } from "./link-widget";

const MARK_FULL = "Autolink";

export function getAutoLinkSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) return;

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
