import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import { type ExtensionsOptions } from "@/extensions";

export type EditorArguments = {
  root: HTMLElement;
  initialText?: string;
  multiCursor?: MultiCursorOptions;
} & ExtensionsOptions;

export type MultiCursorOptions = {
  url: string;
  userName?: string;
  userColor?: string;
  roomId: string;
  autoInsert?: boolean;
  onChangeStatusProvider?: (
    event: ProviderStatusEvent,
    provider: WebsocketProvider,
    doc: Text,
  ) => void;
  onSyncProvider?: (synced: boolean, provider: WebsocketProvider, doc: Text) => void;
};

export type ProviderStatusEvent = {
  status?: "connected" | "disconnected" | "connecting";
};
