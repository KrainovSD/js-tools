export { Editor } from "./module";
export type {
  CustomKeyMap,
  DocRange,
  EditorInterface,
  EditorOptions,
  EditorState,
  EditorStateHandle,
  EditorView,
  EditorViewHandle,
  EditorViewUpdate,
  HandleEnterKeyMapEditorFunction,
  HandleEscapeKeyMapEditorFunction,
  KeyMapsOptions,
  ListenersOptions,
  MultiCursorOptions,
  ProviderStatusEvent,
  SettingsOptions,
  Theme,
  YText,
  YWebsocketProvider,
} from "./module";
export type { AutoCompleteOptions, EditorAutoCompleteConfig } from "./extensions/auto-complete";
export type { JSONOptions, LanguageFormatter, LanguageOptions } from "./extensions/language";
export type {
  ContentDecorationOptions,
  EditorLanguages,
  HeaderEntry,
  MarkdownDecorationSettings,
  MarkdownOptions,
  MarkdownStateType,
  SelectionDecorationOptions,
  StateDecorationOptions,
  TreeIndex,
  TreeIndexHandler,
} from "./extensions/markdown";
export type { SearchMatch } from "./extensions/search";
export type { VimGetter, VimMapping, VimMode, VimOptions, VimUnMapping } from "./extensions/vim";
