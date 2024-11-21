import clsx from "clsx";
import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getLineDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "ATXHeading";
const MARK = "HeaderMark";

export function getHeaderDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (!node.name.startsWith(MARK_FULL)) {
    return;
  }

  const level = node.name.replace(MARK_FULL, "");

  if (view.state.doc.sliceString(node.from + +level).charCodeAt(0) !== 32) return;

  decorations.push(
    getLineDecoration({
      style: clsx(styles.header, styles[`level_${level}`]),
      range: [view.lineBlockAt(node.from).from],
    }),
  );
}

export function getHeaderHideDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (!node.name.startsWith(MARK)) {
    return;
  }

  const line = view.lineBlockAt(node.from);

  if (line.length < node.to - node.from + 1) return;

  if (isInRange(view.state.selection.ranges, [line.from, line.to]) && view.hasFocus) {
    return;
  }

  decorations.push(getHideDecoration({ range: [node.from, node.to + 1] }));
}
