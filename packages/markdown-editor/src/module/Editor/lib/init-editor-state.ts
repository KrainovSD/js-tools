import { EditorState } from "@codemirror/state";
import { type InitExtensionsOptions, initExtensions } from "@/extensions";

type InitEditorStateOptions = {
  text: string;
} & InitExtensionsOptions;

export function initEditorState({ text, ...rest }: InitEditorStateOptions) {
  return EditorState.create({
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    doc: rest.multiCursorText ? rest.multiCursorText.toString() : text,
    extensions: initExtensions(rest),
  });
}
