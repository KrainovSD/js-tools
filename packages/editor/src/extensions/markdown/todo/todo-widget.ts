import { type ChangeSpec } from "@codemirror/state";
import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import { CLASSES } from "../classes-constants";

export class TodoWidget extends WidgetType {
  view: EditorView | undefined;
  private controller = new AbortController();

  constructor(
    public checked: boolean,
    private readonly position: number,
  ) {
    super();
  }

  onClick = (event: MouseEvent) => {
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
  };

  onBlock = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  toDOM(view: EditorView): HTMLElement {
    this.controller.abort();
    this.controller = new AbortController();
    const span = document.createElement("span");
    span.classList.add(CLASSES.todo);
    this.view = view;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = this.checked;

    checkbox.addEventListener("click", this.onBlock, { signal: this.controller.signal });
    checkbox.addEventListener("mousedown", this.onClick, { signal: this.controller.signal });

    span.appendChild(checkbox);

    return span;
  }

  destroy(): void {
    this.controller.abort();
    this.view = undefined;
  }
}
