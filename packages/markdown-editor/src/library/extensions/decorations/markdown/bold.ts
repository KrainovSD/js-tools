import { syntaxTree } from "@codemirror/language";
import type { GetDecorationsOptions } from "./decoration-markdown-types";
import { getHideDecoration, getMarkDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

const MARK_FULL = "StrongEmphasis";

export function getBoldDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  const step =
    view.state.doc.sliceString(node.from - 1, node.from) === "*" &&
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

export function getBoldHideDecorations({ decorations, node, view }: GetDecorationsOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  if (
    view.state.doc.sliceString(node.from - 1, node.from) === "*" &&
    syntaxTree(view.state).resolve(node.from - 1).type.name !== "Emphasis"
  ) {
    return;
  }

  if (isInRange(view.state.selection.ranges, [node.from, node.to]) && view.hasFocus) {
    return;
  }

  decorations.push(getHideDecoration({ range: [node.from, node.from + 2] }));
  decorations.push(getHideDecoration({ range: [node.to - 2, node.to] }));
}
