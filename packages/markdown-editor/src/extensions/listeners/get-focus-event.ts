import { type EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export type GetFocusEventOptions = {
  onFocus?: (state: EditorState) => void;
  onBlur?: (state: EditorState) => void;
};

export function getFocusEvent({ onBlur, onFocus }: GetFocusEventOptions) {
  return onFocus || onBlur
    ? EditorView.focusChangeEffect.of((e, focus) => {
        if (focus && onFocus) onFocus(e);
        else if (!focus && onBlur) onBlur(e);

        return null;
      })
    : [];
}
