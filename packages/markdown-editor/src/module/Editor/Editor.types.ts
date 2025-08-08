import type { EditorState as EditorStateLib } from "@codemirror/state";
import type { EditorView as EditorViewLib, ViewUpdate } from "@codemirror/view";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import { type ExtensionsOptions } from "@/extensions";

export type YWebsocketProvider = WebsocketProvider;
export type YText = Text;
export type EditorView = EditorViewLib;
export type EditorViewUpdate = ViewUpdate;
export type EditorState = EditorStateLib;

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
    provider: YWebsocketProvider,
    doc: YText,
  ) => void;
  onSyncProvider?: (synced: boolean, provider: YWebsocketProvider, doc: YText) => void;
};

export type ProviderStatusEvent = {
  status?: "connected" | "disconnected" | "connecting";
};
