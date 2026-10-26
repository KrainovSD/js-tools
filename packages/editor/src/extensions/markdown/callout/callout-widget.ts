import { WidgetType } from "@codemirror/view";
import { CLASSES } from "../classes-constants";
import { CALLOUT_TYPES, type CalloutType } from "./callout-constants";

export class CalloutWidget extends WidgetType {
  constructor(
    private readonly type: CalloutType,
    private readonly defaultTitle?: string,
  ) {
    super();
  }

  eq(other: CalloutWidget) {
    return (
      other instanceof CalloutWidget &&
      other.type === this.type &&
      other.defaultTitle === this.defaultTitle
    );
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(CLASSES.calloutIcon);
    span.innerHTML = CALLOUT_TYPES[this.type].icon;

    if (this.defaultTitle) {
      const title = document.createElement("span");
      title.classList.add(CLASSES.calloutTitle);
      title.textContent = this.defaultTitle;
      span.appendChild(title);
    }

    return span;
  }
}
