import { type EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export type GetFocusEventOptions = {
  onFocus?: HandleFocusEditorFunction;
  onBlur?: HandleBlurEditorFunction;
};

export type HandleFocusEditorFunction = (state: EditorState) => void;
export type HandleBlurEditorFunction = (state: EditorState) => void;

export function getFocusEvent({ onBlur, onFocus }: GetFocusEventOptions) {
  return onFocus || onBlur
    ? EditorView.focusChangeEffect.of((e, focus) => {
        if (focus && onFocus) onFocus(e);
        else if (!focus && onBlur) onBlur(e);

        return null;
      })
    : [];
}
