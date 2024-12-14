import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import {
  CODE_OF_ORDERED_LIST_MARK,
  LIST_OF_LIST_MARKS,
  NAME_OF_LIST,
  NAME_OF_TODO,
} from "./list-constants";
import { ListPointWidget } from "./list-widget";

export function getListSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== NAME_OF_LIST) {
    return;
  }

  const content = view.state.doc.sliceString(node.from, node.to);
  const lastCodePoint = content.codePointAt(content.length - 1) || 0;
  if (!LIST_OF_LIST_MARKS.has(lastCodePoint) && CODE_OF_ORDERED_LIST_MARK !== lastCodePoint) {
    return;
  }

  const nextSibling = node.node.nextSibling;
  if (nextSibling && nextSibling.name === NAME_OF_TODO) {
    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [node.from, nextSibling.from + 3])
    ) {
      decorations.push(utils.getHideDecoration({ range: [node.from, nextSibling.from] }));
    }

    return;
  }

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.to],
        widget: new ListPointWidget(content, lastCodePoint),
      }),
    );
  }
}
