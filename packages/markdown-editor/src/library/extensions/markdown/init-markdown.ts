import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import type { Extension } from "@codemirror/state";
import { Tag, styleTags, tags } from "@lezer/highlight";

const customTags = {
  inlineCode: Tag.define(tags.monospace),
};

const customTagStyles = styleTags({
  InlineCode: [tags.monospace, customTags.inlineCode],
});

export type InitMarkdownOptions = {};

export const initMarkdown = (): Extension => {
  return markdown({
    base: markdownLanguage,
    codeLanguages: languages,
    addKeymap: true,
    extensions: [{ props: [customTagStyles] }],
  });
};
