import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import type { MultiCursorOptions } from "../Editor.types";

type InitEditorProviderOptions = {
  initialText?: string;
} & MultiCursorOptions;

export function initEditorProvider({
  roomId,
  url,
  userName = "Anonymous",
  userColor,
  initialText,
  onStartProvider,
}: InitEditorProviderOptions) {
  const multiCursorDocument = new Doc();
  const multiCursorText = multiCursorDocument.getText(roomId);

  if (!userColor || !userColor.startsWith("#")) {
    // eslint-disable-next-line no-console
    console.warn("user color must be hex!");
    userColor = "#30bced";
  }
  const userColorLight = `${userColor.substring(0, 7)}33`;

  const provider = new WebsocketProvider(url, roomId, multiCursorDocument);
  provider.awareness.setLocalStateField("user", {
    name: userName,
    color: userColor,
    colorLight: userColorLight,
  });

  if (onStartProvider)
    provider.on("status", (event: { status: string }) => {
      onStartProvider(event?.status);
    });

  if (provider && multiCursorText)
    provider.on("sync", (isSynced: boolean) => {
      if (isSynced && !multiCursorText.length && initialText) {
        multiCursorText.insert(0, initialText);
      }
    });

  return { provider, multiCursorText };
}
