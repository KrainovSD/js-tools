import { WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import type { GetSelectionDecorationOptions } from "../markdown-types";
import styles from "../styles.module.scss";

const MARK_FULL = "ListMark";
const CHAR_CODES_COMMON = new Set([42, 45]);
const CHAR_CODES_ORDERED = 46;

export function getListSelectionDecorations({
  decorations,
  node,
  view,
  isReadonly,
}: GetSelectionDecorationOptions) {
  if (node.name !== MARK_FULL) {
    return;
  }

  const content = view.state.doc.sliceString(node.from, node.to);
  const lastCodePoint = content.codePointAt(content.length - 1) || 0;
  if (!CHAR_CODES_COMMON.has(lastCodePoint) && CHAR_CODES_ORDERED !== lastCodePoint) {
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

class ListPointWidget extends WidgetType {
  constructor(
    private readonly mark: string,
    private readonly lastCodePoint: number,
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(styles.list);
    span.textContent = this.mark;
    if (CHAR_CODES_COMMON.has(this.lastCodePoint)) {
      span.classList.add(styles.common);
    }
    if (CHAR_CODES_ORDERED === this.lastCodePoint) {
      span.classList.add(styles.ordered);
    }

    return span;
  }
}
