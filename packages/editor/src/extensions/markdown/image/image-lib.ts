import type { EditorState } from "@codemirror/state";
import type { SyntaxNodeRef } from "@lezer/common";
import { parseLink } from "../link/link-lib";
import type { ImageEntry } from "./image-model";

export type { ImageEntry } from "./image-model";

export function parseImage(state: EditorState, node: SyntaxNodeRef): ImageEntry {
  return parseLink(state, node);
}
