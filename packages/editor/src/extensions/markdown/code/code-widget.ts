import { WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";

export class CodeWidget extends WidgetType {
  private timer: NodeJS.Timeout | undefined;
  private button: HTMLElement | undefined;
  private span: HTMLElement | undefined;
  private contoller = new AbortController();

  constructor(
    private readonly language: string,
    private content: string | undefined,
  ) {
    super();
  }

  onClick = () => {
    if (this.content && this.button && this.span) {
      const span = this.span;
      const button = this.button;
      clearTimeout(this.timer);
      button.classList.remove(CLASSES.codeButtonPending);
      button.classList.remove(CLASSES.codeButtonSuccess);
      button.classList.remove(CLASSES.codeButtonFail);

      button.classList.add(CLASSES.codeButtonPending);

      span.classList.add(CLASSES.codeButtonSpanHidden);

      void utils
        .copyToClipboard(this.content)
        .then(() => {
          button.classList.remove(CLASSES.codeButtonPending);

          button.classList.add(CLASSES.codeButtonSuccess);

          this.timer = setTimeout(() => {
            button.classList.remove(CLASSES.codeButtonSuccess);
            span.classList.remove(CLASSES.codeButtonSpanHidden);
          }, 500);
        })
        .catch(() => {
          button.classList.remove(CLASSES.codeButtonPending);
          button.classList.add(CLASSES.codeButtonFail);

          this.timer = setTimeout(() => {
            button.classList.remove(CLASSES.codeButtonFail);

            span.classList.remove(CLASSES.codeButtonSpanHidden);
          }, 500);
        });
    }
  };

  toDOM(): HTMLElement {
    this.contoller.abort();
    this.contoller = new AbortController();
    const span = document.createElement("span");
    span.classList.add(CLASSES.codeButtonSpan);
    span.textContent = this.language;
    const button = document.createElement("button");
    button.classList.add(CLASSES.codeButton);
    if (this.content)
      button.addEventListener("click", this.onClick, { signal: this.contoller.signal });
    button.appendChild(span);
    this.button = button;
    this.span = span;
    return button;
  }

  destroy(): void {
    this.contoller.abort();
  }
}
