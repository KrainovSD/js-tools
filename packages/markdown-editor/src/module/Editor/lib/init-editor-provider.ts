import type { MultiCursorOptions, ProviderStatusEvent } from "../Editor.types";

type InitEditorProviderOptions = {
  initialText?: string;
} & MultiCursorOptions;

export async function initEditorProvider({
  roomId,
  url,
  userName = "Anonymous",
  userColor,
  initialText,
  ...opts
}: InitEditorProviderOptions) {
  const { Doc } = await import("yjs");
  const { WebsocketProvider } = await import("y-websocket");

  const multiCursorDocument = new Doc();
  const multiCursorText = multiCursorDocument.getText("codemirror");

  if (!userColor?.startsWith?.("#")) {
    console.warn("user color must be hex!");
    userColor = "#30bced";
  }
  const userColorLight = `${userColor.substring(0, 7)}33`;

  const provider = new WebsocketProvider(url, roomId, multiCursorDocument, {
    disableBc: opts.disableBc,
  });
  provider.awareness.setLocalStateField("user", {
    name: userName,
    color: userColor,
    colorLight: userColorLight,
  });

  if (opts.onChangeStatusProvider)
    provider.on("status", (event: ProviderStatusEvent) => {
      opts.onChangeStatusProvider?.(event, provider, multiCursorText);
    });

  provider.on("sync", (isSynced: boolean) => {
    if (opts.onSyncProvider) {
      opts.onSyncProvider(isSynced, provider, multiCursorText);
    }

    if (opts.autoInsert && isSynced && !multiCursorText.length && initialText) {
      multiCursorText.insert(0, initialText);
    }
  });

  return { provider, multiCursorText };
}
