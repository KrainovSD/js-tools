import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import type { AnnotationType, Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { styleTags } from "@lezer/highlight";
import type { MarkdownParser } from "@lezer/markdown";
import { NewListRenumber } from "@/extensions/markdown/list";
import { boldKeymap, codeKeymap, italicKeymap, linkKeymap, pasteLink, todoKeymap } from "./keymaps";
import { markdownDecorationPlugin } from "./markdown-decoration";
import { markdownParserPlugin } from "./markdown-parser";
import { markdownSkin } from "./markdown-skin";
import { markdownState } from "./markdown-state";
import type { MarkdownOptions } from "./markdown-types";

const taglessStyles = styleTags(
  Object.fromEntries(
    (markdownLanguage.parser as MarkdownParser).nodeSet.types.flatMap((type) =>
      type.name ? [[type.name, []]] : [],
    ),
  ),
);

export function NewMarkdownLanguage(
  markdownOptions: MarkdownOptions | undefined,
  ySyncAnnotation: AnnotationType<unknown> | undefined,
): Extension[] {
  return [
    markdownState,
    markdownSkin,
    markdown({
      base: markdownLanguage,
      codeLanguages: markdownOptions?.languages,
      addKeymap: true,
      pasteURLAsLink: false,
      extensions: [markdownParserPlugin, { props: [taglessStyles] }],
    }),
    pasteLink,
    NewListRenumber(ySyncAnnotation),
    markdownDecorationPlugin({ ...markdownOptions }),
    keymap.of([boldKeymap, italicKeymap, linkKeymap, codeKeymap, todoKeymap]),
  ];
}
