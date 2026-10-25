import type { EditorState } from "@codemirror/state";
import type { SyntaxNodeRef } from "@lezer/common";
import {
  CODE_OF_CLOSE_BRACKET,
  CODE_OF_CLOSE_PAREN,
  CODE_OF_OPEN_BRACKET,
  CODE_OF_OPEN_PAREN,
} from "../markdown-model";
import type { ImageEntry } from "./image-model";

export type { ImageEntry } from "./image-model";

export function parseImage(state: EditorState, node: SyntaxNodeRef): ImageEntry {
  const content = state.doc.sliceString(node.from, node.to);
  const textCoordinates = { from: -1, to: -1 };
  const urlCoordinates = { from: -1, to: -1 };
  let pos = -1;
  while (pos < content.length) {
    pos++;
    const code = content.charCodeAt(pos);

    if (textCoordinates.from === -1 && code === CODE_OF_OPEN_BRACKET)
      textCoordinates.from = pos + 1;
    else if (urlCoordinates.from === -1 && textCoordinates.to !== -1 && code === CODE_OF_OPEN_PAREN)
      urlCoordinates.from = pos + 1;
    else if (
      textCoordinates.from !== -1 &&
      textCoordinates.to === -1 &&
      code === CODE_OF_CLOSE_BRACKET
    )
      textCoordinates.to = pos;
    else if (urlCoordinates.from !== -1 && urlCoordinates.to === -1 && code === CODE_OF_CLOSE_PAREN)
      urlCoordinates.to = pos;
  }
  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);
  return { text, url, from: node.from, to: node.to };
}
