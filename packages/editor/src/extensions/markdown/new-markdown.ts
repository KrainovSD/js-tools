import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import type { AnnotationType, Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { styleTags } from "@lezer/highlight";
import type { MarkdownParser } from "@lezer/markdown";
import { NewListRenumber } from "@/extensions/markdown/list/list-renumber";
import { NewFold } from "./fold";
import { NewImageViewer } from "./image/image-viewer";
import { boldKeymap } from "./keymaps/bold-key-map";
import { codeKeymap } from "./keymaps/code-key-map";
import { italicKeymap } from "./keymaps/italic-key-map";
import { linkKeymap } from "./keymaps/link-key-map";
import { OnPasteLink } from "./keymaps/paste-link";
import { todoKeymap } from "./keymaps/todo-key-map";
import { type MarkdownOptions } from "./markdown-model";
import { markdownParserPlugin } from "./markdown-parser";
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
    NewFold(),
    markdown({
      base: markdownLanguage,
      codeLanguages: markdownOptions?.languages,
      addKeymap: true,
      pasteURLAsLink: false,
      extensions: [markdownParserPlugin, { props: [taglessStyles] }],
    }),
    NewState(markdownOptions),
    NewViewDecorations({ ...markdownOptions, openImageFullscreen }),
    keymap.of([boldKeymap, italicKeymap, linkKeymap, codeKeymap, todoKeymap]),
    OnPasteLink,
    NewListRenumber(ySyncAnnotation),
  ];
}
