import type { MarkdownExtension } from "@lezer/markdown";
import { shortLinkParser } from "./link/short-link-parser";
import { mentionParser } from "./mention/mention-parser";
import { underlineParser } from "./underline/underline-parser";

export const markdownParserPlugin: MarkdownExtension = [
  mentionParser,
  shortLinkParser,
  underlineParser,
];
