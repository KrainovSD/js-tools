import { WidgetType } from "@codemirror/view";
import { CLASSES } from "@/extensions/theme";
import styles from "../styles.module.scss";
import { CODE_OF_ORDERED_LIST_MARK, LIST_OF_LIST_MARKS } from "./list-constants";

export class ListPointWidget extends WidgetType {
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
    if (LIST_OF_LIST_MARKS.has(this.lastCodePoint)) {
      span.classList.add(styles.common);
      span.classList.add(CLASSES.listCommon);
    }
    if (CODE_OF_ORDERED_LIST_MARK === this.lastCodePoint) {
      span.classList.add(styles.ordered);
    }

    return span;
  }
}
