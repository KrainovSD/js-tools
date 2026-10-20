import type { MarkdownExtension } from "@lezer/markdown";
import { shortLinkParser } from "./link";
import { mentionParser } from "./mention";
import { underlineParser } from "./underline";

export const markdownParserPlugin: MarkdownExtension = [
  mentionParser,
  shortLinkParser,
  underlineParser,
];
