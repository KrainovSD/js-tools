import type { MarkdownExtension } from "@lezer/markdown";
import { footnoteParser } from "./footnote/footnote-parser";
import { hashtagParser } from "./hashtag/hashtag-parser";
import { highlightParser } from "./highlight/highlight-parser";
import { shortLinkParser } from "./link/short-link-parser";
import { mentionParser } from "./mention/mention-parser";
import { underlineParser } from "./underline/underline-parser";

export const markdownParserPlugin: MarkdownExtension = [
  mentionParser,
  shortLinkParser,
  underlineParser,
  highlightParser,
  hashtagParser,
  footnoteParser,
];
