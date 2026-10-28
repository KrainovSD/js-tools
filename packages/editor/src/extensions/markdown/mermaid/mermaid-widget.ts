import { EditorView, WidgetType } from "@codemirror/view";
import { randomString, saveDispatch } from "@/lib/utils";
import { CLASSES } from "../classes-constants";
import { getTreeIndex } from "../markdown-tree-index";
import { namespaceMarkers, renderMermaidDiagram, resolveFontFamily } from "./mermaid-lib";
import type { MermaidSettings } from "./mermaid-model";

const ESTIMATED_HEIGHT = 50;

export class MermaidWidget extends WidgetType {
  private controller: AbortController | undefined;
  private dom: HTMLElement | undefined;
  private destroyed = false;

  constructor(
    private readonly source: string,
    private readonly settings: MermaidSettings,
  ) {
    super();
  }

  eq(other: MermaidWidget) {
    return this.source === other.source;
  }

  get estimatedHeight() {
    return ESTIMATED_HEIGHT;
  }

  toDOM(view: EditorView): HTMLElement {
    this.controller = new AbortController();
    const { signal } = this.controller;
    const root = document.createElement("div");
    root.classList.add(CLASSES.mermaid, CLASSES.mermaidPending);
    root.addEventListener("click", this.getClickListener(view), { signal });
    this.dom = root;

    if (this.source.trim() === "") {
      root.textContent = this.settings.emptyLabel;
      return root;
    }

    const width = view.contentDOM.clientWidth || view.scrollDOM.clientWidth || window.innerWidth;
    requestAnimationFrame(() => {
      const fontFamily = resolveFontFamily(view.contentDOM);
      renderMermaidDiagram(this.source, width, fontFamily, this.settings.config).then(
        (svg) => {
          if (this.destroyed || this.dom !== root) return;
          root.classList.remove(CLASSES.mermaidPending);
          root.innerHTML = svg;
          namespaceMarkers(root, randomString(16));
          view.requestMeasure();
        },
        (error: unknown) => {
          if (this.destroyed || this.dom !== root) return;
          root.classList.remove(CLASSES.mermaidPending);
          root.classList.add(CLASSES.mermaidError);
          root.textContent = `${this.settings.errorLabel}:\n${
            error instanceof Error ? error.message : String(error)
          }`;
        },
      );
    });

    return root;
  }

  destroy() {
    this.controller?.abort();
    this.controller = undefined;
    this.dom = undefined;
    this.destroyed = true;
  }

  private getClickListener(view: EditorView) {
    return (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!view.state.facet(EditorView.editable)) return;
      if (!this.dom) return;
      const pos = view.posAtDOM(this.dom);
      const fresh = getTreeIndex(view.state).mermaids.find(
        (mermaid) => mermaid.from <= pos && pos <= mermaid.to,
      );
      if (!fresh) return;
      const firstLine = view.state.doc.lineAt(fresh.from);
      const anchor = Math.min(firstLine.to + 1, fresh.to);
      saveDispatch(() => {
        view.dispatch({ selection: { anchor, head: anchor }, userEvent: "select" });
        view.focus();
      });
    };
  }
}
