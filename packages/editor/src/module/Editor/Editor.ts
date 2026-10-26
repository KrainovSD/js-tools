import { autocompletion } from "@codemirror/autocomplete";
import { history, historyKeymap, indentWithTab, standardKeymap } from "@codemirror/commands";
import { type AnnotationType, EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import type { YSyncConfig } from "y-codemirror.next";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import {
  type AutoCompleteOptions,
  DefaultAutoCompleteOptions,
  tagAutoComplete,
} from "@/extensions/auto-complete";
import {
  AutocompleteCompartment,
  LanguageCompartment,
  ReadonlyCompartment,
  ThemeCompartment,
  VimModeCompartment,
} from "@/extensions/compartments";
import { type LanguageFormatter, type LanguageOptions, NewLanguage } from "@/extensions/language";
import {
  NewSearch,
  type SearchMatch,
  SearchState,
  findMatches,
  getCharCodes,
  gotoSearchEffect,
  setSearchEffect,
} from "@/extensions/search";
import { NewVim, type VimGetter } from "@/extensions/vim";
import { saveDispatch } from "@/lib/utils";
import {
  type CustomKeyMap,
  type EditorOptions,
  type KeyMapsOptions,
  type ListenersOptions,
  type MultiCursorOptions,
  type ProviderStatusEvent,
} from "./Editor.types";

export class Editor {
  view: EditorView | undefined;
  provider: WebsocketProvider | undefined;
  yText: Text | undefined;
  private ySyncAnnotation: AnnotationType<YSyncConfig> | undefined;
  private vimGetter: VimGetter;
  private initialText: string | undefined;
  private root: HTMLElement;
  private multiCursor: MultiCursorOptions | undefined;
  private listeners: ListenersOptions | undefined;
  private keymaps: KeyMapsOptions | undefined;
  private autocomplete: AutoCompleteOptions | undefined;
  private language: LanguageOptions;
  private formatter: LanguageFormatter | undefined;
  private formatOnOpen = false;
  private vim = false;
  private readonly = false;
  private theme: Extension | undefined;

  constructor(opts: EditorOptions) {
    this.vimGetter = NewVim(opts?.vim);
    this.initialText = opts.initialText;
    this.root = opts.root;
    this.multiCursor = opts.multiCursor;
    this.listeners = opts.listeners;
    this.keymaps = opts.keymaps;
    this.autocomplete = opts.autocomplete;
    this.language = opts.language ?? { name: "markdown" };
    this.formatOnOpen = opts.formatOnOpen ?? false;
    this.vim = opts.settings?.vim ?? false;
    this.readonly = opts.settings?.readonly ?? false;
    this.theme = opts?.theme;
  }

  init = async () => {
    const extensions: Extension[] = [];
    let provider: WebsocketProvider | undefined;
    let multiCursorText: Text | undefined;
    if (this.multiCursor) {
      ({ provider, multiCursorText } = await this.initProvider(this.multiCursor));
      if (provider && multiCursorText) {
        const multiCursorModules = await Promise.all([import("yjs"), import("y-codemirror.next")]);
        const [{ UndoManager }, { yCollab, ySyncAnnotation }] = multiCursorModules;
        const undoManager = new UndoManager(multiCursorText);
        this.ySyncAnnotation = ySyncAnnotation;
        extensions.push(yCollab(multiCursorText, provider.awareness, { undoManager }));
      }
    }
    const vimPlugin = await this.vimGetter(this.vim);
    const keyMapPlugin = await this.initKeyMap();
    const [language, formatter] = await NewLanguage(this.language, this.ySyncAnnotation);
    this.formatter = formatter;
    if (this.formatOnOpen && this.initialText && this.formatter) {
      try {
        this.initialText = this.formatter(this.initialText);
      } catch {}
    }
    extensions.push([
      EditorView.theme({
        "&.cm-editor": {
          height: "100%",
          width: "100%",
        },
        "&.cm-editor.cm-focused": {
          outline: "none",
        },
        "& .cm-content": {
          fontFamily: "var(--ksd-editor-font, inherit)",
          maxWidth: "100%",
        },
        "& .cm-selectionBackground": {
          background: "color-mix(in srgb, currentColor 18%, transparent)",
        },
        "&.cm-focused > .cm-scroller > .cm-selectionLayer > .cm-selectionBackground": {
          background: "color-mix(in srgb, currentColor 30%, transparent)",
        },
      }),
      AutocompleteCompartment.of(this.initAutocomplete()),
      ReadonlyCompartment.of(EditorView.editable.of(!this.readonly)),
      VimModeCompartment.of(vimPlugin),
      ThemeCompartment.of(this.theme ?? []),
      history(),
      NewSearch(),
      EditorView.lineWrapping,
      keyMapPlugin,
      LanguageCompartment.of(language),
    ]);
    if (this.listeners?.onChange || this.listeners?.onViewChange) {
      const onViewChange = this.listeners?.onViewChange;
      const onChange = this.listeners?.onChange;
      extensions.push(
        EditorView.updateListener.of((event) => {
          onViewChange?.(event);
          if (event.docChanged) {
            onChange?.(event);
          }
        }),
      );
    }
    if (this.listeners?.onBlur || this.listeners?.onFocus) {
      const onFocus = this.listeners?.onFocus;
      const onBlur = this.listeners?.onBlur;
      extensions.push(
        EditorView.focusChangeEffect.of((event, focus) => {
          if (focus && onFocus) onFocus(event);
          else if (!focus && onBlur) onBlur(event);
          return null;
        }),
      );
    }

    const state = EditorState.create({
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      doc: multiCursorText ? multiCursorText.toString() : this.initialText,
      extensions,
    });
    const view = new EditorView({
      state,
      parent: this.root,
    });
    this.view = view;
    this.provider = provider;
    this.yText = multiCursorText;
  };

  private initProvider = async (opts: MultiCursorOptions) => {
    const { Doc } = await import("yjs");
    const { WebsocketProvider } = await import("y-websocket");
    const multiCursorDocument = new Doc();
    const multiCursorText = multiCursorDocument.getText("codemirror");
    let userColor = opts.userColor;
    if (!userColor?.startsWith?.("#")) {
      console.warn("user color must be hex!");
      userColor = "#30bced";
    }
    const provider = new WebsocketProvider(opts.url, opts.roomId, multiCursorDocument, {
      disableBc: opts.disableBc,
    });
    provider.awareness.setLocalStateField("user", {
      name: opts.userName ?? "Anonymous",
      color: userColor,
      colorLight: `${userColor.substring(0, 7)}33`,
    });

    if (opts.onChangeStatusProvider)
      provider.on("status", (event: ProviderStatusEvent) => {
        opts.onChangeStatusProvider?.(event, provider, multiCursorText);
      });

    provider.on("sync", (isSynced: boolean) => {
      if (opts.onSyncProvider) {
        opts.onSyncProvider(isSynced, provider, multiCursorText);
      }

      if (opts.autoInsert && isSynced && !multiCursorText.length && this.initialText) {
        multiCursorText.insert(0, this.initialText);
      }
    });
    return { provider, multiCursorText };
  };

  private initAutocomplete = () => {
    const autocomplete: Extension[] = [];
    if (this.autocomplete) {
      autocomplete.push(
        autocompletion({
          ...DefaultAutoCompleteOptions,
          ...(this.autocomplete.config ?? {}),
          override: [
            ...(this.autocomplete.tags?.length ? [tagAutoComplete(this.autocomplete.tags)] : []),
            ...(this.autocomplete.sources ?? []),
          ],
        }),
      );
    }
    return autocomplete;
  };

  private initKeyMap = async (): Promise<Extension> => {
    const keyBindings: CustomKeyMap[] = [indentWithTab];
    keyBindings.push(
      ...standardKeymap.map<CustomKeyMap>((keyMap) => {
        if (keyMap.key === "Enter" && this.keymaps?.onEnter) {
          const onEnter = this.keymaps.onEnter;
          return {
            key: "Enter",
            shift: keyMap.run,
            run: (view) => {
              const response = onEnter(view);
              if (response) keyMap.run?.(view);
              return response;
            },
          };
        }
        return keyMap;
      }),
    );
    if (this.keymaps?.vim)
      keyBindings.push({
        key: "Mod-Alt-v",
        run: (view) => {
          this.vim = !this.vim;
          void this.vimGetter(this.vim).then((vimExtension) => {
            saveDispatch(() => {
              view.dispatch({
                effects: VimModeCompartment.reconfigure(vimExtension),
              });
            });
          });
          return true;
        },
      });
    keyBindings.push({
      key: "Shift-Alt-f",
      run: () => {
        if (!this.formatter) return false;
        void this.format();
        return true;
      },
    });
    if (this.keymaps?.onEscape) {
      const onEscape = this.keymaps.onEscape;
      keyBindings.push({
        key: "Escape",
        run: (view) => {
          return onEscape(view);
        },
      });
    }
    if (this.keymaps?.custom) {
      keyBindings.push(...this.keymaps.custom);
    }
    if (this.multiCursor && this.provider) {
      const { yUndoManagerKeymap } = await import("y-codemirror.next");
      keyBindings.push(...yUndoManagerKeymap);
    } else {
      keyBindings.push(...historyKeymap);
    }
    return keymap.of(keyBindings);
  };

  destroy = () => {
    return new Promise((resolve) => {
      saveDispatch(() => {
        this.view?.destroy?.();
        this.provider?.destroy?.();
        resolve(true);
      });
    });
  };

  focus = () => {
    if (!this.view) return;
    this.view.focus();
  };

  search = (text: string): Promise<SearchMatch[] | undefined> => {
    return new Promise<SearchMatch[] | undefined>((resolve) => {
      if (!this.view) {
        return void resolve(undefined);
      }
      const query = text.trim() ? text : "";
      saveDispatch(() => {
        const view = this.view;
        if (!view) {
          return void resolve(undefined);
        }
        if (query) {
          const matches = findMatches(view.state.doc, getCharCodes(query));
          if (matches.length) {
            view.dispatch({
              effects: [
                setSearchEffect.of(query),
                EditorView.scrollIntoView(matches[0].from, { y: "center" }),
              ],
              selection: { anchor: matches[0].from, head: matches[0].from },
            });
            view.focus();
            return void resolve(matches);
          }
        }
        view.dispatch({ effects: [setSearchEffect.of(query)] });
        return void resolve(undefined);
      });
    });
  };

  nextSearch = () => {
    this.gotoSearch(1);
  };

  prevSearch = () => {
    this.gotoSearch(-1);
  };

  gotoSearch = (delta: number) => {
    saveDispatch(() => {
      const view = this.view;
      if (!view) return;
      const state = view.state.field(SearchState, false);
      if (!state || state.matches.length < 2) return;
      const index = (state.index + delta + state.matches.length) % state.matches.length;
      const match = state.matches[index];
      view.dispatch({
        effects: [
          gotoSearchEffect.of(index),
          EditorView.scrollIntoView(match.from, { y: "center" }),
        ],
        selection: { anchor: match.from, head: match.from },
      });
      view.focus();
    });
  };

  getContent = () => {
    if (!this.view) return;
    return this.view.state.doc.toString();
  };

  setContent = (content: string, position?: number) => {
    if (!this.view) return;
    if (position == undefined) {
      const cursor = this.view.state.selection.main.head;
      position = cursor;
    }
    const transaction = this.view.state.update({
      changes: {
        from: position,
        insert: content,
      },
    });
    saveDispatch(() => {
      if (!this.view) return;

      this.view.dispatch(transaction);
    });
  };

  replaceContent = (content: string) => {
    if (!this.view) return;
    const transaction = this.view.state.update({
      changes: { from: 0, to: this.view.state.doc.length, insert: content },
    });
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch(transaction);
    });
  };

  format = (): boolean => {
    if (!this.view || this.readonly || !this.formatter) return false;
    const formatter = this.formatter;
    let formatted: string;
    try {
      formatted = formatter(this.view.state.doc.toString());
    } catch {
      return false;
    }
    if (typeof formatted !== "string") return false;
    saveDispatch(() => {
      if (!this.view) return;
      if (formatted === this.view.state.doc.toString()) return;
      this.view.dispatch(
        this.view.state.update({
          changes: { from: 0, to: this.view.state.doc.length, insert: formatted },
        }),
      );
    });
    return true;
  };

  setReadonly = (readonly: boolean) => {
    saveDispatch(() => {
      if (!this.view) return;
      this.readonly = readonly;
      this.view.dispatch({
        effects: ReadonlyCompartment.reconfigure(EditorView.editable.of(!readonly)),
      });
    });
  };

  setTheme = (theme: Extension) => {
    saveDispatch(() => {
      if (!this.view) return;
      this.theme = theme;
      this.view.dispatch({
        effects: ThemeCompartment.reconfigure(theme),
      });
    });
  };

  setVimMode = async (mode: boolean) => {
    if (!this.view) return;
    this.vim = mode;
    const vimPlugin = await this.vimGetter(this.vim);
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch({
        effects: VimModeCompartment.reconfigure(vimPlugin),
      });
    });
  };

  setAutocomplete = (opts: AutoCompleteOptions) => {
    if (!this.view) return;
    this.autocomplete = opts;
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch({
        effects: [AutocompleteCompartment.reconfigure(this.initAutocomplete())],
      });
    });
  };

  setLanguage = async (opts: LanguageOptions) => {
    if (!this.view) return;
    this.language = opts;
    const [language, formatter] = await NewLanguage(this.language, this.ySyncAnnotation);
    this.formatter = formatter;
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch({
        effects: [LanguageCompartment.reconfigure(language)],
      });
    });
  };

  setUserProvider = (name: string = "Anonymous", color: string = "#000000") => {
    if (!this.provider) return;
    this.provider.awareness.setLocalStateField("user", { name, color });
  };
}

export type EditorInterface = typeof Editor;
