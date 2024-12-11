import { syntaxTree } from "@codemirror/language";
import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK_FULL = "StrongEmphasis";
const MARKS = new Set([95, 42]);

export function getBoldDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  const step =
    MARKS.has(view.state.doc.sliceString(node.from - 1, node.from).charCodeAt(0)) &&
    syntaxTree(view.state).resolve(node.from - 1).type.name !== "Emphasis"
      ? 1
      : 0;

  decorations.push(
    utils.getMarkDecoration({
      style: styles.bold,
      range: [node.from - step, node.to + step],
    }),
  );
}

export function getBoldSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  if (
    MARKS.has(view.state.doc.sliceString(node.from - 1, node.from).charCodeAt(0)) &&
    syntaxTree(view.state).resolve(node.from - 1).type.name !== "Emphasis"
  ) {
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
