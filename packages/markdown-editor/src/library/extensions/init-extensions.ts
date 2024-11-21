import type { Extension } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import { initDecorations } from "./decorations";
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
  readonly,
  vimMode,
  multiCursorText,
  provider,
  theme,
  fontFamily,
}: InitExtensionsOptions): Extension[] => {
  const extensions = [
    InitSettings({ readonly, vimMode }),
    initMarkdown(),
    initTheme({ fontFamily, theme }),
    initKeyMaps({ onEnter }),
    initDecorations(),
    initListeners({ onBlur, onChange, onFocus }),
  ];

  if (multiCursorText && provider) {
    extensions.push(yCollab(multiCursorText, provider.awareness));
  }

  return extensions;
};
