import { WebsocketProvider } from "y-websocket";
import type { Doc } from "yjs";
import type { MultiCursorOptions } from "../Editor.types";

type InitEditorProviderOptions = {
  multiCursorDocument: Doc;
  logger?: boolean;
} & MultiCursorOptions;

export function initEditorProvider({
  roomId,
  url,
  userName = "Anonymous",
  userColor,
  multiCursorDocument,
  logger,
}: InitEditorProviderOptions) {
  const provider = new WebsocketProvider(url, roomId, multiCursorDocument);
  provider.awareness.setLocalStateField("user", {
    name: userName,
    color: userColor || "#000000",
  });

  if (logger)
    provider.on("status", (event: { status: string }) => {
      // eslint-disable-next-line no-console
      console.log(event?.status);
    });

  return provider;
}
