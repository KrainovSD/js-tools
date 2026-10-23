import { WidgetType } from "@codemirror/view";
import { CLASSES } from "../classes-constants";
import styles from "../styles.module.scss";
import { LIST_OF_LIST_MARKS, LIST_OF_ORDERED_LIST_MARKS } from "./list-model";

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
    if (LIST_OF_ORDERED_LIST_MARKS.has(this.lastCodePoint)) {
      span.classList.add(CLASSES.listOrdered);
    }

    return span;
  }
}
