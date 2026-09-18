import { utils } from "@/lib";
import type {
  DecorationPlugin,
  GetDecorationOptions,
  GetSelectionDecorationOptions,
} from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_UNDERLINE } from "./underline-constants";

function getUnderlineDecorations({ decorations, node }: GetDecorationOptions) {
  if (node.name !== NAME_OF_UNDERLINE) {
    return;
  }

  decorations.push(
    utils.getMarkDecoration({
      style: styles.underline,
      range: [node.from, node.to],
    }),
  );
}

function getUnderlineSelectionDecorations({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_UNDERLINE) {
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

export const underlineDecorationPlugin: DecorationPlugin = {
  decorations: [getUnderlineDecorations],
  selectionDecorations: [getUnderlineSelectionDecorations],
};
