import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type { ContentDecorationOptions, SelectionDecorationOptions } from "../markdown-model";
import styles from "../styles.module.scss";

export function fillMentionContentDecorations(opts: ContentDecorationOptions) {
  opts.decorations.push(
    Decoration.mark({
      class: clsx(styles.mention, CLASSES.mention),
    }).range(opts.node.from, opts.node.to),
  );
}

export function fillMentionSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
  }
}
