import { autocompletion } from "@codemirror/autocomplete";
import { history, historyKeymap, indentWithTab, standardKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import { type AutoCompleteOptions, tagAutoComplete } from "@/extensions/auto-complete";
import {
  ReadonlyCompartment,
  ThemeCompartment,
  VimModeCompartment,
} from "@/extensions/compartments";
import {
  boldKeymap,
  codeKeymap,
  italicKeymap,
  linkKeymap,
  pasteLink,
  todoKeymap,
} from "@/extensions/keymaps";
import {
  type MarkdownOptions,
  markdownDecorationPlugin,
  markdownParserPlugin,
  markdownState,
} from "@/extensions/markdown";
import { NewDarkTheme, NewLightTheme, type Theme } from "@/extensions/theme";
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
  private vimGetter: VimGetter;
  private darkTheme: Extension;
  private lightTheme: Extension;
  private initialText: string | undefined;
  private root: HTMLElement;
  private multiCursor: MultiCursorOptions | undefined;
  private listeners: ListenersOptions | undefined;
  private markdown: MarkdownOptions | undefined;
  private keymaps: KeyMapsOptions | undefined;
  private autocomplete: AutoCompleteOptions | undefined;
  private vim = false;
  private readonly = false;
  private theme: Theme = "light";

  constructor(opts: EditorOptions) {
    this.vimGetter = NewVim(opts?.vim);
    this.darkTheme = NewDarkTheme(opts?.themes?.dark);
    this.lightTheme = NewLightTheme(opts?.themes?.light);
    this.initialText = opts.initialText;
    this.root = opts.root;
    this.multiCursor = opts.multiCursor;
    this.listeners = opts.listeners;
    this.markdown = opts.markdown;
    this.keymaps = opts.keymaps;
    this.autocomplete = opts.autocomplete;
    this.vim = opts.settings?.vim ?? false;
    this.readonly = opts.settings?.readonly ?? false;
    this.theme = opts.settings?.theme ?? "light";
  }

  init = async () => {
    let provider: WebsocketProvider | undefined;
    let multiCursorText: Text | undefined;
    if (this.multiCursor) {
      ({ provider, multiCursorText } = await this.initProvider(this.multiCursor));
    }
    const vimPlugin = await this.vimGetter(this.vim);
    const asyncPlugins = await Promise.all([this.initKeyMap()]);
    const extensions = [
      ReadonlyCompartment.of(EditorView.editable.of(!this.readonly)),
      VimModeCompartment.of(vimPlugin),
      ThemeCompartment.of(this.theme === "dark" ? this.darkTheme : this.lightTheme),
      history(),
      EditorView.lineWrapping,
      ...asyncPlugins,
      markdownState,
      markdown({
        base: markdownLanguage,
        codeLanguages: this.markdown?.languages,
        addKeymap: true,
        pasteURLAsLink: false,
        extensions: [markdownParserPlugin],
      }),
      pasteLink,
      markdownDecorationPlugin({ ...this.markdown }),
    ];
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
    if (this.autocomplete) {
      extensions.push(
        autocompletion({
          activateOnTyping: true,
          activateOnTypingDelay: 100,
          selectOnOpen: true,
          closeOnBlur: true,
          maxRenderedOptions: 20,
          aboveCursor: false,
          defaultKeymap: true,
          icons: false,
          filterStrict: false,
          interactionDelay: 75,
          updateSyncTime: 100,
          ...(this.autocomplete?.config ?? {}),
          override: [tagAutoComplete(this.autocomplete.tags)],
        }),
      );
    }
    if (multiCursorText && provider) {
      const multiCursorModules = await Promise.all([import("yjs"), import("y-codemirror.next")]);
      const [{ UndoManager }, { yCollab }] = multiCursorModules;
      const undoManager = new UndoManager(multiCursorText);
      extensions.push(yCollab(multiCursorText, provider.awareness, { undoManager }));
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

  private initKeyMap = async (): Promise<Extension> => {
    const keyBindings: CustomKeyMap[] = [
      indentWithTab,
      boldKeymap,
      italicKeymap,
      linkKeymap,
      codeKeymap,
      todoKeymap,
    ];
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
    if (this.keymaps?.defaults?.vim)
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

    if (this.keymaps?.defaults?.theme)
      keyBindings.push({
        key: "Mod-Alt-a",
        run: (view) => {
          this.theme = this.theme === "light" ? "dark" : "light";
          saveDispatch(() => {
            view.dispatch({
              effects: ThemeCompartment.reconfigure(
                this.theme === "dark" ? this.darkTheme : this.lightTheme,
              ),
            });
          });
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

  setReadonly = (readonly: boolean) => {
    saveDispatch(() => {
      if (!this.view) return;
      this.readonly = readonly;
      this.view.dispatch({
        effects: ReadonlyCompartment.reconfigure(EditorView.editable.of(!readonly)),
      });
    });
  };

  setTheme = (theme: Theme) => {
    saveDispatch(() => {
      if (!this.view) return;
      this.theme = theme;
      this.view.dispatch({
        effects: ThemeCompartment.reconfigure(
          this.theme === "dark" ? this.darkTheme : this.lightTheme,
        ),
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

  setUserProvider = (name: string = "Anonymous", color: string = "#000000") => {
    if (!this.provider) return;
    this.provider.awareness.setLocalStateField("user", { name, color });
  };
}

export type EditorInterface = typeof Editor;
