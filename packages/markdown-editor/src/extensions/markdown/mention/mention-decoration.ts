import clsx from "clsx";
import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import type { GetDecorationOptions, GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { NAME_OF_MENTION } from "./mention-constants";

export function getMentionDecorations({ decorations, node }: GetDecorationOptions) {
  if (node.name !== NAME_OF_MENTION) {
    return;
  }

  decorations.push(
    utils.getMarkDecoration({
      style: clsx(styles.mention, CLASSES.mention),
      range: [node.from, node.to],
    }),
  );
}

export function getMentionSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_MENTION) {
    return;
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(utils.getHideDecoration({ range: [node.from, node.from + 1] }));
  }
}
