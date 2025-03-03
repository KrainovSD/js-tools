import type { MultiCursorOptions } from "../Editor.types";

type InitEditorProviderOptions = {
  initialText?: string;
} & MultiCursorOptions;

export async function initEditorProvider({
  roomId,
  url,
  userName = "Anonymous",
  userColor,
  initialText,
  onStartProvider,
}: InitEditorProviderOptions) {
  const { Doc } = await import("yjs");
  const { WebsocketProvider } = await import("y-websocket");

  const multiCursorDocument = new Doc();
  const multiCursorText = multiCursorDocument.getText(roomId);

  if (!userColor?.startsWith?.("#")) {
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
