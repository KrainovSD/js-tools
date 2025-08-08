import { EditorView } from "@codemirror/view";
import type { EditorViewUpdate } from "@/module";

export type GetChangeEventOptions = {
  onChange?: HandleChangeEditorFunction;
};

export type HandleChangeEditorFunction = (view: EditorViewUpdate) => void;

export function getChangeEvent({ onChange }: GetChangeEventOptions) {
  return onChange
    ? EditorView.updateListener.of((event) => {
        if (event.docChanged) {
          onChange(event);
        }
      })
    : [];
}
