import clsx from "clsx";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type { DecorationPlugin, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_HORIZONTAL } from "./horizontal-constants";

function getHorizontalSelectionDecoration({
  decorations,
  forceActive,
  node,
  view,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_HORIZONTAL) return;

  const line = view.lineBlockAt(node.from);

  if (
    forceActive ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      utils.getLineDecoration({
        style: clsx(styles.horizontal, CLASSES.horizontal),
        range: [line.from],
      }),
    );
    decorations.push(utils.getHideDecoration({ range: [node.from, node.to] }));
  }
}

export const horizontalDecorationPlugin: DecorationPlugin = {
  selectionDecorations: [getHorizontalSelectionDecoration],
};
