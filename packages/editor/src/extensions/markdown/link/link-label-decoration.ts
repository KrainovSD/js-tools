import { utils } from "@/lib";
import { type GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { CODE_OF_LINK_LABEL_END } from "./link-constants";

// [label]:

export function getLinkLabelSelectionDecoration({
  decorations,
  node,
  view,
  forceActive,
}: GetSelectionDecorationOptions) {
  if (view.state.doc.sliceString(node.to, node.to + 1).charCodeAt(0) !== CODE_OF_LINK_LABEL_END)
    return;

  if (
    forceActive ||
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
