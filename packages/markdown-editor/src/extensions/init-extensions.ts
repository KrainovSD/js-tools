import type { Extension } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import type { WebsocketProvider } from "y-websocket";
import { type Text, UndoManager } from "yjs";
import { type InitKeyMapsOptions, initKeyMaps } from "./keymaps";
import { type InitListenersOptions, initListeners } from "./listeners";
import { type InitMarkdownOptions, initMarkdown } from "./markdown";
import { InitSettings, type InitSettingsOptions } from "./settings";
import { type InitThemeOptions, initTheme } from "./theme";

export type ExtensionsOptions = InitListenersOptions &
  InitThemeOptions &
  InitSettingsOptions &
  InitMarkdownOptions &
  InitKeyMapsOptions;

export type InitExtensionsOptions = {
  multiCursorText: Text | undefined;
  provider: WebsocketProvider | undefined;
} & ExtensionsOptions;

export const initExtensions = ({
  onBlur,
  onChange,
  onFocus,
  onEnter,
  onEscape,
  readonly,
  vimMode,
  multiCursorText,
  provider,
  theme,
  dark,
  light,
  languages,
}: InitExtensionsOptions): Extension[] => {
  const multiCursorMode = Boolean(multiCursorText && provider);

  const extensions = [
    InitSettings({ readonly, vimMode }),
    initMarkdown({ languages }),
    initTheme({ theme, dark, light }),
    initKeyMaps({ onEnter, onEscape, multiCursorMode }),
    initListeners({ onBlur, onChange, onFocus }),
  ];

  if (multiCursorText && provider) {
    const undoManager = new UndoManager(multiCursorText);
    extensions.push(yCollab(multiCursorText, provider.awareness, { undoManager }));
  }

  return extensions;
};
