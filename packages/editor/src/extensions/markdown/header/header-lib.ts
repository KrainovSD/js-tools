import type { EditorState } from "@codemirror/state";
import type { SyntaxNodeRef } from "@lezer/common";
import { getHeaderId } from "@/lib/utils";
import {
  type HeaderEntry,
  NAME_OF_HEADER,
  NAME_OF_HEADER_MARK,
  NAME_OF_HEADER_UNDER,
} from "./header-model";

export function parseHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry | undefined {
  const mark = node.node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) {
    return;
  }
  const slug = getHeaderId(state.doc.sliceString(mark.to, state.doc.lineAt(node.from).to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER.length)),
  };
}

export function parseSetextHeader(
  state: EditorState,
  node: SyntaxNodeRef,
  slugs: Map<string, number>,
): HeaderEntry {
  const textLine = state.doc.lineAt(node.from);
  const slug = getHeaderId(state.doc.sliceString(textLine.from, textLine.to).trim());
  const index = slugs.get(slug) ?? 0;
  slugs.set(slug, index + 1);
  return {
    lineStart: state.doc.lineAt(node.from).from,
    from: node.from,
    to: node.to,
    id: index > 0 ? `${slug}-${index}` : slug,
    slug,
    level: Number(node.name.slice(NAME_OF_HEADER_UNDER.length)),
  };
}
