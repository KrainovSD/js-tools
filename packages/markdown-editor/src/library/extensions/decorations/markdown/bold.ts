import { syntaxTree } from "@codemirror/language";
import type {
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

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
    getMarkDecoration({
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
    !isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(getHideDecoration({ range: [node.from, node.from + 2] }));
    decorations.push(getHideDecoration({ range: [node.to - 2, node.to] }));
  }
}
