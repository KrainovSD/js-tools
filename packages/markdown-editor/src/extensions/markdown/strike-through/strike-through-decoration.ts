import { utils } from "@/lib";
import type {
  DecorationMap,
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
  SelectionDecorationMap,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_STRIKE_THROUGH } from "./strike-through-constants";

export function getStrikeThroughDecorations({ decorations, node }: GetDecorationOptions) {
  decorations.push(
    utils.getMarkDecoration({
      style: styles["strike-through"],
      range: [node.from, node.to],
    }),
  );
}

export function getStrikeThroughSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
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
  [NAME_OF_STRIKE_THROUGH]: getStrikeThroughDecorations,
};
const selectionDecorations: SelectionDecorationMap = {
  [NAME_OF_STRIKE_THROUGH]: getStrikeThroughSelectionDecorations,
};
export const strikeThroughDecorationPlugin: DecorationPlugin = {
  decorations,
  selectionDecorations,
};
