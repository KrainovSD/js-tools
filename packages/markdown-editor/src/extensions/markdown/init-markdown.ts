import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { type Extension } from "@codemirror/state";
import { markdownDecorationPlugin } from "./markdown-decoration";
import type { InitMarkdownOptions } from "./markdown-types";
import { mentionParser } from "./mention";

export const initMarkdown = ({ languages }: InitMarkdownOptions): Extension => {
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
