import type { GetDecorationsOptions, GetHideDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "Strikethrough";

export function getStrikeThroughDecorations({ decorations, node }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  decorations.push(
    getMarkDecoration({
      style: styles["strike-through"],
      range: [node.from, node.to],
    }),
  );
}

export function getStrikeThroughHideDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetHideDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    !isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(getHideDecoration({ range: [node.from, node.from + 2] }));
    decorations.push(getHideDecoration({ range: [node.to - 2, node.to] }));
  }
}
