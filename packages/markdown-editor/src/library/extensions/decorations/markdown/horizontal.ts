import { type GetSelectionDecorationOptions } from "./decoration-markdown-types";
import { getHideDecoration, getLineDecoration, isInRange } from "./lib";
import styles from "./styles.module.scss";

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
    !isInRange(view.state.selection.ranges, [line.from, line.to])
  ) {
    decorations.push(
      getLineDecoration({
        style: styles.horizontal,
        range: [line.from],
      }),
    );
    decorations.push(getHideDecoration({ range: [node.from, node.to] }));
  }
}
