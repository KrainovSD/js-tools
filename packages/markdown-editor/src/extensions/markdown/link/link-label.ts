import { utils } from "@/lib";
import { type GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const CODE_OF_END = 58; // :

export function getLinkLabelSelectionDecoration({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (view.state.doc.sliceString(node.to, node.to + 1).charCodeAt(0) !== CODE_OF_END) return;

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to + 1])
  ) {
    decorations.push(
      utils.getMarkDecoration({
        range: [node.from, node.to + 1],
        style: styles.link__label,
      }),
    );
    decorations.push(utils.getHideDecoration({ range: [node.from, node.from + 1] }));
    decorations.push(utils.getHideDecoration({ range: [node.to - 1, node.to + 1] }));
  }
}
