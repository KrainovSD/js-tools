import { Decoration } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";
import {
  CODE_OF_CYRILLIC_HA,
  CODE_OF_LATIN_X,
  NAME_OF_LIST_MARK,
  type SelectionDecorationOptions,
} from "../markdown-model";
import { TodoWidget } from "./todo-widget";

const LIST_OF_TODO_MARKS = new Set([CODE_OF_LATIN_X, CODE_OF_CYRILLIC_HA]); // x, х

export function fillTodoSelectionDecorations(opts: SelectionDecorationOptions) {
  const { view, node, decorations, readonly } = opts;
  const prevSibling = node.node.prevSibling;
  if (!prevSibling || prevSibling.name !== NAME_OF_LIST_MARK) return;
  const isChecked = LIST_OF_TODO_MARKS.has(
    view.state.doc.sliceString(node.from + 1, node.from + 2).codePointAt(0) ?? 0,
  );

  if (
    readonly ||
    !view.hasFocus ||
    !utils.isInRange(view.state.selection.ranges, [prevSibling.from, node.from + 3])
  ) {
    decorations.push(
      Decoration.replace({
        widget: new TodoWidget(isChecked, node.from + 1),
      }).range(node.from, node.from + 3),
    );
  }

  if (isChecked) {
    const line = view.lineBlockAt(node.from);
    if (
      readonly ||
      !view.hasFocus ||
      !utils.isInRange(view.state.selection.ranges, [line.from, line.to])
    )
      decorations.push(
        Decoration.mark({
          class: CLASSES.todoChecked,
        }).range(node.from + 4, node.to),
      );
  }
}
