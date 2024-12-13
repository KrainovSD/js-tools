import { EditorView } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { type WebsocketProvider } from "y-websocket";
import {
  ReadonlyCompartment,
  ThemeCompartment,
  VimModeCompartment,
  getDarkTheme,
  getLightTheme,
} from "@/extensions";
import { type EditorArguments } from "./Editor.types";
import { initEditor } from "./lib";

export class Editor {
  view: EditorView;

  provider: WebsocketProvider | undefined;

  arguments: EditorArguments;

  constructor(options: EditorArguments) {
    const editor = initEditor(options);
    this.arguments = options;
    this.view = editor.view;
    this.provider = editor.provider;
  }

  focus = () => {
    this.view.focus();
  };

  getContent = () => {
    return this.view.state.doc.toString();
  };

  setReadonly = (readonly: boolean) => {
    this.view.dispatch({
      effects: ReadonlyCompartment.reconfigure(EditorView.editable.of(!readonly)),
    });
  };

  setTheme = (theme?: "dark" | "light") => {
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

  setVimMode = (mode: boolean) => {
    this.view.dispatch({
      effects: VimModeCompartment.reconfigure(mode ? vim({ status: true }) : []),
    });
  };

  setUserProvider = (name: string = "Anonymous", color: string = "#000000") => {
    if (this.provider) this.provider.awareness.setLocalStateField("user", { name, color });
  };

  destroy = () => {
    this.view.destroy();
    if (this.provider) this.provider.destroy();
  };
}

export type EditorInterface = typeof Editor;
