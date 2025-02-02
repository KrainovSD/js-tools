import { syntaxTree } from "@codemirror/language";
import { utils } from "@/lib";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { LIST_OF_BOLD_MARKS, NAME_OF_BOLD } from "./bold-constants";

function getBoldDecorations({ decorations, node, view }: GetDecorationOptions) {
  if (node.name !== NAME_OF_BOLD) {
    return;
  }

  const step =
    LIST_OF_BOLD_MARKS.has(view.state.doc.sliceString(node.from - 1, node.from).charCodeAt(0)) &&
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

function getBoldSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_BOLD) {
    return;
  }

  if (
    LIST_OF_BOLD_MARKS.has(view.state.doc.sliceString(node.from - 1, node.from).charCodeAt(0)) &&
    syntaxTree(view.state).resolve(node.from - 1).type.name !== "Emphasis"
  ) {
    return;
  }

  if (
    forceActive ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(utils.getHideDecoration({ range: [node.from, node.from + 2] }));
    decorations.push(utils.getHideDecoration({ range: [node.to - 2, node.to] }));
  }
}

export const boldDecorationPlugin: DecorationPlugin = {
  decorations: [getBoldDecorations],
  selectionDecorations: [getBoldSelectionDecorations],
};
