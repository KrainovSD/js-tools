import { type ChangeSpec } from "@codemirror/state";
import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import styles from "../styles.module.scss";

export class TodoWidget extends WidgetType {
  view: EditorView | undefined;

  constructor(
    public checked: boolean,
    private readonly position: number,
  ) {
    super();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const target = event.target as HTMLInputElement;
    const change: ChangeSpec = {
      from: this.position,
      to: this.position + 1,
      insert: this.checked ? " " : "x",
    };

    saveDispatch(() => {
      if (!this.view) return;

      this.view.dispatch(this.view.state.update({ changes: change }));
    });

    this.checked = !this.checked;
    target.checked = this.checked;
  }

  onBlock(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  toDOM(view: EditorView): HTMLElement {
    const span = document.createElement("span");
    span.classList.add(styles.todo);
    this.view = view;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = this.checked;

    checkbox.addEventListener("click", this.onBlock.bind(this));
    checkbox.addEventListener("mousedown", this.onClick.bind(this));

    span.appendChild(checkbox);

    return span;
  }

  destroy(dom: HTMLElement): void {
    dom.removeEventListener("click", this.onBlock.bind(this));
    dom.removeEventListener("mousedown", this.onClick.bind(this));
  }
}
