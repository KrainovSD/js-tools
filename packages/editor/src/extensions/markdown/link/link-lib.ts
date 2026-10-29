import type { EditorState } from "@codemirror/state";
import type { SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import {
  CODE_OF_GREATER_THAN,
  CODE_OF_LESS_THAN,
  NAME_OF_ESCAPE,
  NAME_OF_LINK_MARK,
  NAME_OF_URL,
} from "../markdown-model";
import type { LinkEntry } from "./link-model";

export type { LinkEntry } from "./link-model";

export function parseLink(state: EditorState, node: SyntaxNodeRef): LinkEntry {
  const urlNode = node.node.getChild(NAME_OF_URL);
  let url = urlNode ? state.doc.sliceString(urlNode.from, urlNode.to) : "";
  if (
    url.charCodeAt(0) === CODE_OF_LESS_THAN &&
    url.charCodeAt(url.length - 1) === CODE_OF_GREATER_THAN
  ) {
    url = url.slice(1, -1);
  }
  let text = "";
  let openMark: SyntaxNode | undefined;
  let pos = -1;
  let child = node.node.firstChild;
  while (child) {
    if (child.name === NAME_OF_LINK_MARK) {
      if (!openMark) {
        openMark = child;
        pos = child.to;
      } else {
        text = text
          ? text + state.doc.sliceString(pos, child.from)
          : state.doc.sliceString(pos, child.from);
        break;
      }
    } else if (child.name === NAME_OF_ESCAPE) {
      text = text
        ? text + state.doc.sliceString(pos, child.from)
        : state.doc.sliceString(pos, child.from);
      text += state.doc.sliceString(child.from + 1, child.to);
      pos = child.to;
    }
    child = child.nextSibling;
  }
  return { text, url, from: node.from, to: node.to };
}
