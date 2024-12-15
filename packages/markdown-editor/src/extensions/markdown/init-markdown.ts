import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { type Extension } from "@codemirror/state";
import { markdownDecorationPlugin } from "./markdown-decoration";
import { mentionParser } from "./mention";

export const initMarkdown = (): Extension => {
  return [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      addKeymap: true,
      extensions: [mentionParser],
    }),
    markdownDecorationPlugin,
  ];
};
