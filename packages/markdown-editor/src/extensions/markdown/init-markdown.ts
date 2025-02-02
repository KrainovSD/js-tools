import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { type Extension } from "@codemirror/state";
import { markdownDecorationPlugin } from "./markdown-decoration";
import { markdownParserPlugin } from "./markdown-parser";
import { markdownState } from "./markdown-state";
import type { InitMarkdownOptions } from "./markdown-types";

export const initMarkdown = ({ languages, imageSrcGetter }: InitMarkdownOptions): Extension => {
  return [
    markdownState,
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      addKeymap: true,
      extensions: [markdownParserPlugin],
    }),
    markdownDecorationPlugin({ imageSrcGetter }),
  ];
};
