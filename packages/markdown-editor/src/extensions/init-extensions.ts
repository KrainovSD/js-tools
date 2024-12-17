import type { Extension } from "@codemirror/state";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
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

export const initExtensions = async ({
  onBlur,
  onChange,
  onFocus,
  onEnter,
  onEscape,
  readonly = true,
  vimMode = false,
  multiCursorText,
  provider,
  theme = "light",
  dark,
  light,
  languages,
  keyMaps,
  defaultKeyMaps,
}: InitExtensionsOptions): Promise<Extension[]> => {
  const multiCursorMode = Boolean(multiCursorText && provider);

  const extensions = [
    await InitSettings({ readonly, vimMode }),
    initMarkdown({ languages }),
    initTheme({ theme, dark, light }),
    initKeyMaps({
      onEnter,
      onEscape,
      multiCursorMode,
      keyMaps,
      vimMode,
      theme,
      dark,
      defaultKeyMaps,
      light,
    }),
    initListeners({ onBlur, onChange, onFocus }),
  ];

  if (multiCursorText && provider) {
    const { UndoManager } = await import("yjs");
    const { yCollab } = await import("y-codemirror.next");

    const undoManager = new UndoManager(multiCursorText);
    extensions.push(yCollab(multiCursorText, provider.awareness, { undoManager }));
  }

  return extensions;
};
