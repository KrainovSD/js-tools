import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { type Extension } from "@codemirror/state";
import { decorationMarkdownPlugin } from "./decoration-markdown";
import { mentionParser } from "./mention";

export const initMarkdown = (): Extension => {
  return [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      addKeymap: true,
      extensions: [mentionParser],
    }),
    decorationMarkdownPlugin,
  ];
};
