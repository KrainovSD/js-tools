import { type EditorView, WidgetType } from "@codemirror/view";
import { utils } from "@/lib";
import { CLASSES } from "../classes-constants";

export class CodeWidget extends WidgetType {
  view: EditorView | undefined;

  timer: NodeJS.Timeout | undefined;

  button: HTMLElement | undefined;

  span: HTMLElement | undefined;

  constructor(
    private readonly language: string,
    private content: string | undefined,
  ) {
    super();
  }

  onClick() {
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
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;

    const span = document.createElement("span");
    span.classList.add(CLASSES.codeButtonSpan);

    span.textContent = this.language;

    const button = document.createElement("button");
    button.classList.add(CLASSES.codeButton);

    if (this.content) button.addEventListener("click", this.onClick.bind(this));
    button.appendChild(span);

    this.button = button;
    this.span = span;

    return button;
  }

  destroy(dom: HTMLElement): void {
    if (this.content) dom.removeEventListener("click", this.onClick.bind(this));
  }
}
