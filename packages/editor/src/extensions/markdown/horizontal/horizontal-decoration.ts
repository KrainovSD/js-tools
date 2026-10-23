import { Decoration } from "@codemirror/view";
import clsx from "clsx";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import type { SelectionDecorationOptions } from "../markdown-model";
import styles from "../styles.module.scss";

export function fillHorizontalSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const line = view.lineBlockAt(node.from);

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      Decoration.line({
        class: clsx(styles.horizontal, CLASSES.horizontal),
      }).range(line.from),
    );
    decorations.push(Decoration.replace({}).range(node.from, node.to));
  }
}
