import { EditorView, type ViewUpdate } from "@codemirror/view";

export type GetChangeEventOptions = {
  onChange?: HandleChangeEditorFunction;
};

export type HandleChangeEditorFunction = (view: ViewUpdate) => void;

export function getChangeEvent({ onChange }: GetChangeEventOptions) {
  return onChange
    ? EditorView.updateListener.of((event) => {
        if (event.docChanged) {
          onChange(event);
        }
      })
    : [];
}
