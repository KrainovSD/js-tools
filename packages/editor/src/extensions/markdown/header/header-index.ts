import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import type { SyntaxNode, Tree } from "@lezer/common";
import { getHeaderId } from "@/lib/utils";
import { NAME_OF_HEADER, NAME_OF_HEADER_MARK, NAME_OF_HEADER_UNDER } from "./header-constants";

type HeaderIndexEntry = {
  position: number;
  slug: string;
  id: string;
};

type HeaderIndex = {
  byPosition: Map<number, HeaderIndexEntry>;
  byId: Map<string, number>;
};

const headersIndexCache = new WeakMap<Tree, HeaderIndex>();

export function getHeaderPositionById(state: EditorState, id: string): number | undefined {
  if (!id) return undefined;
  return getHeadersIndex(state)?.byId.get(id);
}

export function getHeaderAnchorId(state: EditorState, position: number): string | undefined {
  return getHeadersIndex(state)?.byPosition.get(position)?.id;
}

function getHeadersIndex(state: EditorState): HeaderIndex {
  const currentTree = syntaxTree(state);
  const cached = headersIndexCache.get(currentTree);
  if (cached) return cached;

  const tree = ensureSyntaxTree(state, state.doc.length) ?? currentTree;
  const ensured = headersIndexCache.get(tree);
  if (ensured) return ensured;

  const byPosition = new Map<number, HeaderIndexEntry>();
  const byId = new Map<string, number>();
  const slugCounts = new Map<string, number>();
  tree.iterate({
    enter: (node) => {
      if (!isHeaderNode(node.name)) return undefined;
      const slug = getHeaderId(getHeaderText(state, node.node));
      if (!slug) return undefined;
      const duplicateIndex = slugCounts.get(slug) ?? 0;
      slugCounts.set(slug, duplicateIndex + 1);
      const position = state.doc.lineAt(node.from).from;
      const id = duplicateIndex > 0 ? `${slug}-${duplicateIndex}` : slug;
      byPosition.set(node.from, { position, slug, id });
      if (!byId.has(id)) byId.set(id, position);
      return false;
    },
  });
  const index = { byPosition, byId };
  headersIndexCache.set(tree, index);
  return index;
}

function isHeaderNode(name: string) {
  return name.startsWith(NAME_OF_HEADER) || name.startsWith(NAME_OF_HEADER_UNDER);
}

function getHeaderText(state: EditorState, node: SyntaxNode): string {
  if (node.name.startsWith(NAME_OF_HEADER_UNDER)) {
    const textLine = state.doc.lineAt(node.from);
    return state.doc.sliceString(textLine.from, textLine.to).trim();
  }
  const mark = node.getChild(NAME_OF_HEADER_MARK);
  if (!mark) return "";
  return state.doc.sliceString(mark.to, state.doc.lineAt(node.from).to).trim();
}
