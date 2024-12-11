import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK_FULL = "Strikethrough";

export function getStrikeThroughDecorations({ decorations, node }: GetDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  decorations.push(
    utils.getMarkDecoration({
      style: styles["strike-through"],
      range: [node.from, node.to],
    }),
  );
}

export function getStrikeThroughSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(utils.getHideDecoration({ range: [node.from, node.from + 2] }));
    decorations.push(utils.getHideDecoration({ range: [node.to - 2, node.to] }));
  }
}
