import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "Emphasis";

export function getItalicDecorations({ decorations, node }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  decorations.push(
    getMarkDecoration({
      style: styles.italic,
      range: [node.from, node.to],
    }),
  );
}

export function getItalicHideDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  const step = view.state.doc.sliceString(node.from, node.from + 3) === "***" ? 3 : 1;

  if (isInRange(view.state.selection.ranges, [node.from, node.to]) && view.hasFocus) {
    return;
  }

  decorations.push(getHideDecoration({ range: [node.from, node.from + step] }));
  decorations.push(getHideDecoration({ range: [node.to - step, node.to] }));
}
