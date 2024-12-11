import clsx from "clsx";
import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK_FULL = "ATXHeading";
const MARK_UNDER_FULL = "SetextHeading";
const MARK = "HeaderMark";

export function getHeaderDecorations({ decorations, node, view }: GetDecorationOptions) {
  const isHeader = node.name.startsWith(MARK_FULL);
  const isHeaderUnder = node.name.startsWith(MARK_UNDER_FULL);

  if (!isHeader && !isHeaderUnder) {
    return;
  }

  let level: string | undefined;

  if (isHeader) {
    level = node.name.replace(MARK_FULL, "");

    if (view.state.doc.sliceString(node.from + +level).charCodeAt(0) !== 32) return;
  } else {
    level = node.name.replace(MARK_UNDER_FULL, "");
  }

  if (!level) return;

  decorations.push(
    utils.getLineDecoration({
      style: clsx(styles.header, styles[`level_${level}`]),
      range: [view.lineBlockAt(node.from).from],
    }),
  );
}

export function getHeaderSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  const isHeader = node.name.startsWith(MARK_FULL);
  const isHeaderUnder = node.name.startsWith(MARK_UNDER_FULL);

  if (!isHeader && !isHeaderUnder) {
    return;
  }

  const mark = node.node.getChild(MARK);
  if (!mark) return;

  if (isHeader) {
    const line = view.lineBlockAt(mark.from);
    if (line.length < mark.to - mark.from + 1) return;

    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
    ) {
      decorations.push(utils.getHideDecoration({ range: [mark.from, mark.to + 1] }));
    }
  } else {
    const lineHeader = view.lineBlockAt(node.from);
    const lineMark = view.lineBlockAt(mark.from);

    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [lineHeader.from, lineMark.to])
    ) {
      decorations.push(utils.getHideDecoration({ range: [lineMark.from, lineMark.to] }));
    }
  }
}
