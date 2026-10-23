import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import type { SelectionDecorationOptions } from "../markdown-model";
import { LIST_OF_LIST_MARKS, LIST_OF_ORDERED_LIST_MARKS } from "./list-model";
import { ListPointWidget } from "./list-widget";

const NAME_OF_TODO = "Task";

export function fillListMarkSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const content = view.state.doc.sliceString(node.from, node.to);
  const lastCodePoint = content.codePointAt(content.length - 1) ?? 0;
  if (!LIST_OF_LIST_MARKS.has(lastCodePoint) && !LIST_OF_ORDERED_LIST_MARKS.has(lastCodePoint)) {
    return;
  }

  const nextSibling = node.node.nextSibling;
  if (nextSibling && nextSibling.name === NAME_OF_TODO) {
    if (
      readonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [node.from, nextSibling.from + 3])
    ) {
      decorations.push(Decoration.replace({}).range(node.from, nextSibling.from));
    }
    return;
  }

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [node.from, node.to])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new ListPointWidget(content, lastCodePoint),
      }).range(node.from, node.to),
    );
  }
}
