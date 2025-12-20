import type { Extension } from "@codemirror/state";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import { type InitAutoCompleteOptions, initAutoComplete } from "./auto-completes";
import { type InitKeyMapsOptions, initKeyMaps } from "./keymaps";
import { type InitListenersOptions, initListeners } from "./listeners";
import { type InitMarkdownOptions } from "./markdown";
import { type InitSettingsOptions, initSettings } from "./settings";
import { type InitThemeOptions, initTheme } from "./theme";

export type ExtensionsOptions = InitListenersOptions &
  InitThemeOptions &
  InitSettingsOptions &
  InitMarkdownOptions &
  InitKeyMapsOptions &
  InitAutoCompleteOptions;

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
  onViewChange,
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
  imageSrcGetter,
  autoCompleteTagOptions,
  autoCompleteConfig,
}: InitExtensionsOptions): Promise<Extension[]> => {
  const multiCursorMode = Boolean(multiCursorText && provider);

  const asyncPlugins = await Promise.all([
    initSettings({ readonly, vimMode }),
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
    new Promise<Extension>((resolve) => {
      void import("./markdown").then(({ initMarkdown }) => {
        resolve(initMarkdown({ languages, imageSrcGetter }));
      });
    }),
    initAutoComplete({ autoCompleteConfig, autoCompleteTagOptions }),
  ]);

  const extensions = [
    ...asyncPlugins,
    initTheme({ theme, dark, light }),
    initListeners({ onBlur, onChange, onFocus, onViewChange }),
  ];

  if (multiCursorText && provider) {
    const multiCursorModules = await Promise.all([import("yjs"), import("y-codemirror.next")]);
    const [{ UndoManager }, { yCollab }] = multiCursorModules;

    const undoManager = new UndoManager(multiCursorText);
    extensions.push(yCollab(multiCursorText, provider.awareness, { undoManager }));
  }

  return extensions;
};
