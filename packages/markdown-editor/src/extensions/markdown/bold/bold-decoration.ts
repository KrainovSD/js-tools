import { syntaxTree } from "@codemirror/language";
import { utils } from "@/lib";
import type {
  DecorationMap,
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
  SelectionDecorationMap,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { LIST_OF_BOLD_MARKS, NAME_OF_BOLD } from "./bold-constants";

export function getBoldDecorations({ decorations, node, view }: GetDecorationOptions) {
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

export function getBoldSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (
    LIST_OF_BOLD_MARKS.has(view.state.doc.sliceString(node.from - 1, node.from).charCodeAt(0)) &&
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

const decorations: DecorationMap = {
  [NAME_OF_BOLD]: getBoldDecorations,
};
const selectionDecorations: SelectionDecorationMap = {
  [NAME_OF_BOLD]: getBoldSelectionDecorations,
};
export const boldDecorationPlugin: DecorationPlugin = {
  decorations,
  selectionDecorations,
};
