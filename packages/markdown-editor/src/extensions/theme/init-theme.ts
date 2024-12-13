import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { ThemeCompartment } from "../compartments";
import type { InitThemeOptions } from "./theme.types";
import { getDarkTheme, getLightTheme } from "./themes";

export const initTheme = (options: InitThemeOptions): Extension => {
  const extensions: Extension[] = [
    EditorView.lineWrapping,
    ThemeCompartment.of(options.theme === "dark" ? getDarkTheme(options) : getLightTheme(options)),
  ];

  return extensions;
};
