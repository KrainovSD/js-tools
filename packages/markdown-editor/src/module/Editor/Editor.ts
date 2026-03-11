import { EditorView, drawSelection } from "@codemirror/view";
import type { WebsocketProvider } from "y-websocket";
import type { Text } from "yjs";
import {
  type EditorTheme,
  ReadonlyCompartment,
  ThemeCompartment,
  VimModeCompartment,
  getDarkTheme,
  getLightTheme,
} from "@/extensions";
import { saveDispatch } from "@/lib/utils";
import { type EditorArguments } from "./Editor.types";
import { initEditor } from "./lib";

export class Editor {
  view: EditorView | undefined;

  provider: WebsocketProvider | undefined;

  arguments: EditorArguments | undefined;

  yText: Text | undefined;

  init = async (options: EditorArguments) => {
    const editor = await initEditor(options);
    this.view = editor.view;
    this.provider = editor.provider;
    this.yText = editor.multiCursorText;
    this.arguments = options;
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

  reset = async () => {
    await this.destroy();
    if (!this.arguments) return;
    return this.init(this.arguments);
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
      this.view.dispatch({
        effects: ReadonlyCompartment.reconfigure(EditorView.editable.of(!readonly)),
      });
    });
  };

  setTheme = (theme?: EditorTheme) => {
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch({
        effects: ThemeCompartment.reconfigure(
          theme === "dark"
            ? getDarkTheme({
                dark: this.arguments?.dark,
                light: this.arguments?.light,
                theme,
              })
            : getLightTheme({
                dark: this.arguments?.dark,
                light: this.arguments?.light,
                theme,
              }),
        ),
      });
    });
  };

  setVimMode = async (mode: boolean) => {
    if (!this.view) return;
    const { vim } = await import("@replit/codemirror-vim");
    saveDispatch(() => {
      if (!this.view) return;
      this.view.dispatch({
        effects: VimModeCompartment.reconfigure(
          mode ? [vim({ status: true }), drawSelection()] : [],
        ),
      });
    });
  };

  setUserProvider = (name: string = "Anonymous", color: string = "#000000") => {
    if (!this.provider) return;
    this.provider.awareness.setLocalStateField("user", { name, color });
  };
}

export type EditorInterface = typeof Editor;
