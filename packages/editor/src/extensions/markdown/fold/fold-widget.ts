import { foldEffect, foldable, foldedRanges, unfoldEffect } from "@codemirror/language";
import { type EditorView, WidgetType } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";
import type { DocRange } from "@/module";
import { CLASSES } from "../classes-constants";
import { getHeadingAnchorLine } from "./fold-lib";

const FOLD_ICON =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

export class FoldIndicatorWidget extends WidgetType {
  private view: EditorView | undefined;
  private controller: AbortController | undefined;
  private readonly handleToggle = (event: MouseEvent) => this.onToggle(event);

  constructor(public readonly collapsed: boolean) {
    super();
  }

  eq(other: FoldIndicatorWidget): boolean {
    return other instanceof FoldIndicatorWidget && other.collapsed === this.collapsed;
  }

  updateDOM(dom: HTMLElement): boolean {
    setCollapsed(dom, this.collapsed);
    return true;
  }

  private onToggle = (event: MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    const view = this.view;
    const dom = event.currentTarget as HTMLElement | null;
    if (!view || !dom?.isConnected) return;

    saveDispatch(() => {
      const state = view.state;
      const anchorLine = getHeadingAnchorLine(state, view.posAtDOM(dom));
      if (!anchorLine) return;
      let fold: DocRange | undefined;
      foldedRanges(state).between(anchorLine.to, anchorLine.to + 1, (from, to) => {
        if (from === anchorLine.to) {
          fold = { from, to };
          return false;
        }
      });
      if (fold) {
        view.dispatch({ effects: unfoldEffect.of(fold) });
        return;
      }
      const range = foldable(state, anchorLine.from, anchorLine.to);
      if (range) {
        view.dispatch({ effects: foldEffect.of(range) });
      }
    });
  };

  toDOM(view: EditorView): HTMLElement {
    this.controller = new AbortController();
    const span = document.createElement("span");
    span.classList.add(CLASSES.foldIndicator);
    if (this.collapsed) {
      setCollapsed(span, true);
    }
    span.innerHTML = FOLD_ICON;
    span.addEventListener("mousedown", this.handleToggle, { signal: this.controller.signal });
    this.view = view;
    return span;
  }

  destroy(): void {
    this.controller?.abort();
    this.controller = undefined;
    this.view = undefined;
  }
}

function setCollapsed(dom: HTMLElement, collapsed: boolean): void {
  dom.classList.toggle(CLASSES.foldIndicatorCollapsed, collapsed);
}
