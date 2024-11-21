import { EditorView } from "@codemirror/view";
import { type WebsocketProvider } from "y-websocket";
import { Doc, type Text } from "yjs";
import type { EditorArguments } from "../Editor.types";
import { initEditorProvider } from "./init-editor-provider";
import { initEditorState } from "./init-editor-state";

export function initEditor({ multiCursor, root, initialText, ...rest }: EditorArguments) {
  let multiCursorDocument: Doc | undefined;
  let multiCursorText: Text | undefined;
  let provider: WebsocketProvider | undefined;

  if (multiCursor) {
    multiCursorDocument = new Doc();
    multiCursorText = multiCursorDocument.getText(multiCursor.roomId);

    provider = initEditorProvider({
      ...multiCursor,
      multiCursorDocument,
    });
  }

  if (provider && multiCursorText)
    provider.on("sync", (isSynced: boolean) => {
      if (isSynced && !multiCursorText.length && initialText) {
        multiCursorText.insert(0, initialText);
      }
    });

  const state = initEditorState({ ...rest, text: initialText || "", provider, multiCursorText });
  const view = new EditorView({
    state,
    parent: root,
  });

  return { view, provider };
}
