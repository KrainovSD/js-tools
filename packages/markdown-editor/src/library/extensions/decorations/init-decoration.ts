import type { Extension } from "@codemirror/state";
import { decorationMarkdownPlugin } from "./markdown";

export function initDecorations(): Extension {
  return [decorationMarkdownPlugin];
}
