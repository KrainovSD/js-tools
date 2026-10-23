import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import type { AnnotationType, Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { styleTags } from "@lezer/highlight";
import type { MarkdownParser } from "@lezer/markdown";
import { NewListRenumber } from "@/extensions/markdown/list";
import { NewImageViewer } from "./image";
import {
  OnPasteLink,
  boldKeymap,
  codeKeymap,
  italicKeymap,
  linkKeymap,
  todoKeymap,
} from "./keymaps";
import { type MarkdownOptions } from "./markdown-model";
import { markdownParserPlugin } from "./markdown-parser";
import { Skin } from "./markdown-skin";
import { NewState } from "./markdown-state";
import { NewViewDecorations } from "./markdown-view";

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
  const openImageFullscreen = NewImageViewer({
    imageSrcGetter: markdownOptions?.imageSrcGetter,
    imageFullscreenRoot: markdownOptions?.imageFullscreenRoot,
    imageTransition: markdownOptions?.imageTransition,
  });

  return [
    Skin,
    markdown({
      base: markdownLanguage,
      codeLanguages: markdownOptions?.languages,
      addKeymap: true,
      pasteURLAsLink: false,
      extensions: [markdownParserPlugin, { props: [taglessStyles] }],
    }),
    NewState(),
    NewViewDecorations({ ...markdownOptions, openImageFullscreen }),
    keymap.of([boldKeymap, italicKeymap, linkKeymap, codeKeymap, todoKeymap]),
    OnPasteLink,
    NewListRenumber(ySyncAnnotation),
  ];
}
