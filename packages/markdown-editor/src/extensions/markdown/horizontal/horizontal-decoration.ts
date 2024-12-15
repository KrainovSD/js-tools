import clsx from "clsx";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type {
  DecorationPlugin,
  GetSelectionDecorationOptions,
  SelectionDecorationMap,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_HORIZONTAL } from "./horizontal-constants";

export function getHorizontalSelectionDecoration({
  decorations,
  isReadonly,
  node,
  view,
}: GetSelectionDecorationOptions) {
  const line = view.lineBlockAt(node.from);

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      utils.getLineDecoration({
        style: clsx(styles.horizontal, CLASSES.horizontal),
        range: [line.from],
      }),
    );
    decorations.push(utils.getHideDecoration({ range: [node.from, node.to] }));
  }
}

const selectionDecorations: SelectionDecorationMap = {
  [NAME_OF_HORIZONTAL]: getHorizontalSelectionDecoration,
};
export const horizontalDecorationPlugin: DecorationPlugin = {
  selectionDecorations,
};
