import { utils } from "@/lib";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_STRIKE_THROUGH } from "./strike-through-constants";

function getStrikeThroughDecorations({ decorations, node }: GetDecorationOptions) {
  if (node.name !== NAME_OF_STRIKE_THROUGH) {
    return;
  }

  decorations.push(
    utils.getMarkDecoration({
      style: styles["strike-through"],
      range: [node.from, node.to],
    }),
  );
}

function getStrikeThroughSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_STRIKE_THROUGH) {
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

export const strikeThroughDecorationPlugin: DecorationPlugin = {
  decorations: [getStrikeThroughDecorations],
  selectionDecorations: [getStrikeThroughSelectionDecorations],
};
