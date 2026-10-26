import { WidgetType } from "@codemirror/view";
import { CLASSES } from "../classes-constants";

export class BlockquoteWidget extends WidgetType {
  constructor(private readonly deep: boolean) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(CLASSES.blockquoteInner);
    if (this.deep) span.classList.add(CLASSES.blockquoteInnerDeep);

    return span;
  }
}
