import type { EditorState as EditorStateLib, Extension } from "@codemirror/state";
import type { EditorView as EditorViewLib, KeyBinding, ViewUpdate } from "@codemirror/view";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import type { AutoCompleteOptions } from "@/extensions/auto-complete";
import type { LanguageOptions } from "@/extensions/language";
import type { VimOptions } from "@/extensions/vim";

export type YWebsocketProvider = WebsocketProvider;
export type YText = Text;
export type EditorView = EditorViewLib;
export type EditorViewUpdate = ViewUpdate;
export type EditorState = EditorStateLib;

export type Theme = Extension;

export type EditorOptions = {
  root: HTMLElement;
  initialText?: string;
  language?: LanguageOptions;
  formatOnOpen?: boolean;
  multiCursor?: MultiCursorOptions;
  listeners?: ListenersOptions;
  theme?: Extension;
  settings?: SettingsOptions;
  keymaps?: KeyMapsOptions;
  autocomplete?: AutoCompleteOptions;
  vim?: VimOptions;
};

export type MultiCursorOptions = {
  url: string;
  userName?: string;
  userColor?: string;
  roomId: string;
  autoInsert?: boolean;
  disableBc?: boolean;
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

export type EditorViewHandle = (view: EditorViewUpdate) => void;
export type EditorStateHandle = (state: EditorState) => void;
export type ListenersOptions = {
  onChange?: EditorViewHandle;
  onViewChange?: EditorViewHandle;
  onFocus?: EditorStateHandle;
  onBlur?: EditorStateHandle;
};

export type SettingsOptions = {
  vim?: boolean;
  readonly?: boolean;
};

export type CustomKeyMap = KeyBinding;
export type HandleEnterKeyMapEditorFunction = (view: EditorView) => boolean;
export type HandleEscapeKeyMapEditorFunction = (view: EditorView) => boolean;
export type KeyMapsOptions = {
  onEnter?: HandleEnterKeyMapEditorFunction;
  onEscape?: HandleEscapeKeyMapEditorFunction;
  custom?: CustomKeyMap[];
  vim?: boolean;
};

export type DocRange = {
  from: number;
  to: number;
};
