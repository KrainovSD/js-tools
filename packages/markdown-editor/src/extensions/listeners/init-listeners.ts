import type { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { EditorViewUpdate } from "@/module";

export type InitListenersOptions = GetFocusEventOptions & GetChangeEventOptions;
export type EditorViewHandle = (view: EditorViewUpdate) => void;
export type EditorStateHandle = (state: EditorState) => void;

export function initListeners({ onBlur, onChange, onFocus, onViewChange }: InitListenersOptions) {
  return [getChangeEvent({ onChange, onViewChange }), getFocusEvent({ onBlur, onFocus })];
}

type GetChangeEventOptions = {
  onChange?: EditorViewHandle;
  onViewChange?: EditorViewHandle;
};
function getChangeEvent({ onChange, onViewChange }: GetChangeEventOptions) {
  return onChange || onViewChange
    ? EditorView.updateListener.of((event) => {
        onViewChange?.(event);
        if (event.docChanged) {
          onChange?.(event);
        }
      })
    : [];
}

type GetFocusEventOptions = {
  onFocus?: EditorStateHandle;
  onBlur?: EditorStateHandle;
};
function getFocusEvent({ onBlur, onFocus }: GetFocusEventOptions) {
  return onFocus || onBlur
    ? EditorView.focusChangeEffect.of((event, focus) => {
        if (focus && onFocus) onFocus(event);
        else if (!focus && onBlur) onBlur(event);

        return null;
      })
    : [];
}
