import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import { type EditorState } from "@codemirror/state";
import { type Tree } from "@lezer/common";
import { parseHeader, parseSetextHeader } from "./header/header-lib";
import { NAME_OF_HEADER, NAME_OF_HEADER_UNDER } from "./header/header-model";
import { parseImage } from "./image/image-lib";
import { NAME_OF_IMAGE } from "./image/image-model";
import type { TreeIndex } from "./markdown-model";
import { parseTable } from "./table/table-lib";
import { NAME_OF_TABLE } from "./table/table-model";

const treeIndexCache = new WeakMap<Tree, TreeIndex>();
export function getTreeIndex(state: EditorState, ensure: boolean = false): TreeIndex {
  let currentTree = syntaxTree(state);
  const cached = treeIndexCache.get(currentTree);
  if (cached) {
    return cached;
  }
  if (ensure) {
    const tree = ensureSyntaxTree(state, state.doc.length) ?? currentTree;
    const ensured = treeIndexCache.get(tree);
    if (ensured) {
      return ensured;
    }
    currentTree = tree;
  }
  const index: TreeIndex = {
    headers: [],
    images: [],
    tables: [],
    headersByFrom: new Map(),
    imagesByFrom: new Map(),
  };
  const headerSlugs = new Map<string, number>();
  currentTree.iterate({
    enter: (node) => {
      if (node.name === NAME_OF_TABLE) {
        const table = parseTable(state, node.node);
        if (table) {
          index.tables.push(table);
        }
      } else if (node.name.startsWith(NAME_OF_HEADER)) {
        const header = parseHeader(state, node, headerSlugs);
        if (header) {
          index.headers.push(header);
          index.headersByFrom.set(header.from, header);
        }
      } else if (node.name.startsWith(NAME_OF_HEADER_UNDER)) {
        const header = parseSetextHeader(state, node, headerSlugs);
        if (header) {
          index.headers.push(header);
          index.headersByFrom.set(header.from, header);
        }
      } else if (node.name === NAME_OF_IMAGE) {
        const image = parseImage(state, node);
        index.images.push(image);
        index.imagesByFrom.set(image.from, image);
      }
    },
  });
  treeIndexCache.set(currentTree, index);
  return index;
}
