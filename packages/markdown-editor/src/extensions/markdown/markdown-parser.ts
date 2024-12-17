import type { MarkdownExtension } from "@lezer/markdown";
import { mentionParser } from "./mention";

export const markdownParserPlugin: MarkdownExtension = [mentionParser];
