import type {
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "Strikethrough";

export function getStrikeThroughDecorations({ decorations, node }: GetDecorationOptions) {
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
    !isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(getHideDecoration({ range: [node.from, node.from + 2] }));
    decorations.push(getHideDecoration({ range: [node.to - 2, node.to] }));
  }
}
