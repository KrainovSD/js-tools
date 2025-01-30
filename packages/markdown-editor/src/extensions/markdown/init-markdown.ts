import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { type Extension } from "@codemirror/state";
import { markdownDecorationPlugin } from "./markdown-decoration";
import { markdownParserPlugin } from "./markdown-parser";
import type { InitMarkdownOptions } from "./markdown-types";

export const initMarkdown = ({ languages }: InitMarkdownOptions): Extension => {
  return [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      addKeymap: true,
      extensions: [markdownParserPlugin],
    }),
    markdownDecorationPlugin,
  ];
};
