import type { GetDecorationsOptions, GetHideDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getLineDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK = "QuoteMark";

export function getBlockquoteDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK) {
    return;
  }

  decorations.push(
    getLineDecoration({
      style: styles.blockquote,
      range: [view.lineBlockAt(node.from).from],
    }),
  );
}

export function getBlockquoteHideDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetHideDecorationsOptions) {
  if (node.name !== MARK) {
    return;
  }

  const line = view.lineBlockAt(node.from);

  if (
    isReadonly ||
    !view.hasFocus ||
    !isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(getHideDecoration({ range: [node.from, node.to] }));
  }
}
