import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import type { SyntaxNodeRef, Tree } from "@lezer/common";
import {
  CODE_OF_END_IMAGE_TEXT,
  CODE_OF_END_IMAGE_URL,
  CODE_OF_START_IMAGE_TEXT,
  CODE_OF_START_IMAGE_URL,
  NAME_OF_IMAGE,
} from "./image-constants";

export type ImageEntry = {
  from: number;
  to: number;
  text: string;
  url: string;
};

export type ImageIndexGetter = (view: EditorView) => ImageEntry[];

export function NewImageIndex(): ImageIndexGetter {
  const cache = new WeakMap<Tree, ImageEntry[]>();
  return (view) => {
    const currentTree = syntaxTree(view.state);
    const cached = cache.get(currentTree);
    if (cached) return cached;
    const tree = ensureSyntaxTree(view.state, view.state.doc.length) ?? currentTree;
    const ensured = cache.get(tree);
    if (ensured) return ensured;
    const entries: ImageEntry[] = [];
    tree.iterate({
      enter: (node) => {
        if (node.name !== NAME_OF_IMAGE) return;
        const { text, url } = parseImageInfo(view, node);
        entries.push({ from: node.from, to: node.to, text, url });
      },
    });
    cache.set(tree, entries);
    return entries;
  };
}

export function parseImageInfo(view: EditorView, node: SyntaxNodeRef) {
  const content = view.state.doc.sliceString(node.from, node.to);
  const textCoordinates = { from: -1, to: -1 };
  const urlCoordinates = { from: -1, to: -1 };
  let pos = -1;
  while (pos < content.length) {
    pos++;
    const code = content.charCodeAt(pos);

    if (textCoordinates.from === -1 && code === CODE_OF_START_IMAGE_TEXT)
      textCoordinates.from = pos + 1;
    else if (
      urlCoordinates.from === -1 &&
      textCoordinates.to !== -1 &&
      code === CODE_OF_START_IMAGE_URL
    )
      urlCoordinates.from = pos + 1;
    else if (
      textCoordinates.from !== -1 &&
      textCoordinates.to === -1 &&
      code === CODE_OF_END_IMAGE_TEXT
    )
      textCoordinates.to = pos;
    else if (
      urlCoordinates.from !== -1 &&
      urlCoordinates.to === -1 &&
      code === CODE_OF_END_IMAGE_URL
    )
      urlCoordinates.to = pos;
  }
  const text = content.substring(textCoordinates.from, textCoordinates.to);
  const url = content.substring(urlCoordinates.from, urlCoordinates.to);
  return { text, url };
}
