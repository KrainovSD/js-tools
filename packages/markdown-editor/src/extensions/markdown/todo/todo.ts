import { utils } from "@/lib";
import { type GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";
import { TodoWidget } from "./todo-widget";

const TODO_MARK = "Task";
const LIST_MARK = "ListMark";
const CODES_OF_CHECKED = new Set([120, 1093]); // x

export function getTodoSelectionDecoration({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== TODO_MARK) return;

  const prevSibling = node.node.prevSibling;
  if (!prevSibling || prevSibling.name !== LIST_MARK) return;

  const isChecked = CODES_OF_CHECKED.has(
    view.state.doc.sliceString(node.from + 1, node.from + 2).codePointAt(0) || 0,
  );

  if (
    isReadonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [prevSibling.from, node.from + 3])
  ) {
    decorations.push(
      utils.getReplaceDecoration({
        range: [node.from, node.from + 3],
        widget: new TodoWidget(isChecked, node.from + 1),
      }),
    );
  }

  if (isChecked) {
    const line = view.lineBlockAt(node.from);

    if (
      isReadonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
    )
      decorations.push(
        utils.getMarkDecoration({ style: styles.todo__checked, range: [node.from + 4, node.to] }),
      );
  }
}
