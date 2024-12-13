import { CLASSES } from "@/extensions/theme";
import { utils } from "@/lib";
import { type GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK = "HorizontalRule";

export function getHorizontalSelectionDecoration({
  decorations,
  isReadonly,
  node,
  view,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK) return;

  const line = view.lineBlockAt(node.from);

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      utils.getLineDecoration({
        style: styles.horizontal,
        range: [line.from],
      }),
    );
    decorations.push(
      utils.getLineDecoration({
        style: CLASSES.horizontal,
        range: [line.from],
      }),
    );
    decorations.push(utils.getHideDecoration({ range: [node.from, node.to] }));
  }
}
