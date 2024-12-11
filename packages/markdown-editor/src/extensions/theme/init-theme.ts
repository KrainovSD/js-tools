import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { basicDark } from "cm6-theme-basic-dark";
import { ThemeCompartment } from "../compartments";

export type InitThemeOptions = {
  fontFamily?: string;
  theme?: "dark" | "light";
};

const highlightStyle = HighlightStyle.define([
  {
    tag: tags.blockComment,
    fontFamily: "monospace",
  },
  {
    tag: tags.bool,
    color: "purple",
  },
  {
    tag: tags.string,
    color: "green",
  },
]);

export const initTheme = ({ fontFamily, theme = "light" }: InitThemeOptions): Extension => {
  const extensions: Extension[] = [
    syntaxHighlighting(highlightStyle),
    EditorView.theme({
      ".cm-content": {
        fontFamily: fontFamily || "Montserrat",
      },
      "&.cm-editor.cm-focused": { outline: "none" },
      "&.cm-editor": {
        height: "100% !important",
      },
    }),
    EditorView.lineWrapping,
    ThemeCompartment.of(theme === "dark" ? basicDark : []),
  ];

  return extensions;
};
