import { type Extension } from "@codemirror/state";
import { type EditorView, keymap } from "@codemirror/view";

export const FULLSCREEN_CLASSES = {
  editor: "ksd-cm-fullscreen",
};

function hasFullscreenBackgroundVar(view: EditorView): boolean {
  return Boolean(getComputedStyle(view.dom).getPropertyValue("--ksd-cm-fullscreen-bg").trim());
}

function toggleFullscreen(view: EditorView): boolean {
  const fullscreen = view.dom.classList.toggle(FULLSCREEN_CLASSES.editor);
  view.dom.style.background =
    fullscreen && hasFullscreenBackgroundVar(view) ? "var(--ksd-cm-fullscreen-bg)" : "";
  view.requestMeasure();
  return true;
}

function exitFullscreen(view: EditorView): boolean {
  if (!view.dom.classList.contains(FULLSCREEN_CLASSES.editor)) return false;
  view.dom.classList.remove(FULLSCREEN_CLASSES.editor);
  view.dom.style.background = "";
  view.requestMeasure();
  return true;
}

export function NewFullscreen(): Extension {
  return keymap.of([
    { key: "F11", run: toggleFullscreen },
    { key: "Escape", run: exitFullscreen },
  ]);
}
