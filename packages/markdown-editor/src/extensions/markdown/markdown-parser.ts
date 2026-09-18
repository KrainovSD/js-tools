import type { MarkdownExtension } from "@lezer/markdown";
import { shortLinkParser } from "./link";
import { mentionParser } from "./mention";

export const markdownParserPlugin: MarkdownExtension = [mentionParser, shortLinkParser];
