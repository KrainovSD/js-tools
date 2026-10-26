import { codeFolding, foldedRanges } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { CLASSES } from "../classes-constants";
import { NewFoldIndicators } from "./fold-view";

export * from "./fold-lib";

function foldPlaceholderDOM(view: EditorView, onclick: (event: Event) => void): HTMLElement {
  const element = document.createElement("span");
  element.textContent = "…";
  element.setAttribute("aria-label", view.state.phrase("folded code"));
  element.title = view.state.phrase("unfold");
  element.className = CLASSES.foldPlaceholder;
  element.onmousedown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  element.onclick = onclick;
  return element;
}

export function NewFold(): Extension[] {
  return [
    codeFolding({ placeholderDOM: foldPlaceholderDOM }),
    NewFoldIndicators(),
    EditorView.atomicRanges.of((view) => foldedRanges(view.state)),
  ];
}
