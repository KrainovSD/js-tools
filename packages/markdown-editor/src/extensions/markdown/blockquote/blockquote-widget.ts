import { WidgetType } from "@codemirror/view";
import { CLASSES } from "@/extensions/theme";
import styles from "../styles.module.scss";

export class BlockquoteWidget extends WidgetType {
  constructor(private readonly deep: boolean) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(styles.blockquote__inner);
    if (this.deep) span.classList.add(styles["blockquote__inner-deep"]);
    span.classList.add(CLASSES.blockquoteInner);

    return span;
  }
}
