import { EditorView } from "@codemirror/view";
import type { WebsocketProvider } from "y-websocket";
import {
  type EditorTheme,
  ReadonlyCompartment,
  ThemeCompartment,
  VimModeCompartment,
  getDarkTheme,
  getLightTheme,
} from "@/extensions";
import { type EditorArguments } from "./Editor.types";
import { initEditor } from "./lib";

export class Editor {
  view: EditorView | undefined;

  provider: WebsocketProvider | undefined;

  arguments: EditorArguments;

  constructor(options: EditorArguments) {
    void initEditor(options).then((editor) => {
      this.view = editor.view;
      this.provider = editor.provider;
    });

    this.arguments = options;
  }

  focus = () => {
    if (!this.view) return;

    this.view.focus();
  };

  getContent = () => {
    if (!this.view) return;

    return this.view.state.doc.toString();
  };

  setReadonly = (readonly: boolean) => {
    if (!this.view) return;

    this.view.dispatch({
      effects: ReadonlyCompartment.reconfigure(EditorView.editable.of(!readonly)),
    });
  };

  setTheme = (theme?: EditorTheme) => {
    if (!this.view) return;

    this.view.dispatch({
      effects: ThemeCompartment.reconfigure(
        theme === "dark"
          ? getDarkTheme({
              dark: this.arguments.dark,
              light: this.arguments.light,
              theme,
            })
          : getLightTheme({
              dark: this.arguments.dark,
              light: this.arguments.light,
              theme,
            }),
      ),
    });
  };

  setVimMode = async (mode: boolean) => {
    if (!this.view) return;

    const { vim } = await import("@replit/codemirror-vim");

    this.view.dispatch({
      effects: VimModeCompartment.reconfigure(mode ? vim({ status: true }) : []),
    });
  };

  setUserProvider = (name: string = "Anonymous", color: string = "#000000") => {
    if (!this.provider) return;

    this.provider.awareness.setLocalStateField("user", { name, color });
  };

  destroy = () => {
    if (!this.view) return;

    this.view.destroy();
    if (this.provider) this.provider.destroy();
  };
}

export type EditorInterface = typeof Editor;
