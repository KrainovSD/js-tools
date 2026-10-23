import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import {
  type EditorState,
  type Extension,
  type Range,
  StateEffect,
  StateField,
} from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { type Tree } from "@lezer/common";
import { randomString } from "@/lib/utils";
import { NAME_OF_HEADER, NAME_OF_HEADER_UNDER, parseHeader, parseSetextHeader } from "./header";
import { parseImage } from "./image/image-lib";
import { NAME_OF_IMAGE } from "./image/image-model";
import type { MarkdownStateType, TreeIndex } from "./markdown-model";
import { fillTableStateDecorations } from "./table";
import { parseTable } from "./table/table-lib";
import { NAME_OF_TABLE } from "./table/table-model";

const setFocusEffect = StateEffect.define<boolean>();

export function NewState(): Extension[] {
  return [
    MarkdownState,
    EditorView.focusChangeEffect.of((_state, focusing) => setFocusEffect.of(focusing)),
  ];
}

export const MarkdownState = StateField.define<MarkdownStateType>({
  create: (state) => ({
    uniqueId: randomString(10),
    focused: false,
    decorations: buildDecorations(state, false),
    getHeaders: (state, ensure) => getTreeIndex(state, ensure).headers,
    getImages: (state, ensure) => getTreeIndex(state, ensure).images,
    getTables: (state, ensure) => getTreeIndex(state, ensure).tables,
    getHeaderAt: (state, from) => getTreeIndex(state).headersByFrom.get(from),
    getImageAt: (state, from) => getTreeIndex(state).imagesByFrom.get(from),
  }),

  update: (value, tr) => {
    let focused = value.focused;
    let stateChanged = false;
    for (const effect of tr.effects) {
      if (effect.is(setFocusEffect) && effect.value !== focused) {
        focused = effect.value;
        stateChanged = true;
      }
    }
    const requiredUpdate =
      stateChanged ||
      tr.docChanged ||
      tr.selection !== undefined ||
      syntaxTree(tr.startState) !== syntaxTree(tr.state) ||
      tr.startState.facet(EditorView.editable) != tr.state.facet(EditorView.editable);
    if (!requiredUpdate) return value;
    return { ...value, focused, decorations: buildDecorations(tr.state, focused) };
  },
  provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
});

function buildDecorations(state: EditorState, focused: boolean): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  fillTableStateDecorations({ state, focused, decorations });
  return decorations.length ? Decoration.set(decorations, true) : Decoration.none;
}

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
