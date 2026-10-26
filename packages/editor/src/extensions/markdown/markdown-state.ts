import { foldEffect, syntaxTree, unfoldEffect } from "@codemirror/language";
import {
  type EditorState,
  type Extension,
  type Range,
  StateEffect,
  StateField,
} from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { randomString } from "@/lib/utils";
import type { MarkdownStateType } from "./markdown-model";
import { getTreeIndex } from "./markdown-tree-index";
import { fillTableStateDecorations } from "./table/table-decoration";

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
    let foldChanged = false;
    for (const effect of tr.effects) {
      if (effect.is(setFocusEffect) && effect.value !== focused) {
        focused = effect.value;
        stateChanged = true;
      }
      if (effect.is(foldEffect) || effect.is(unfoldEffect)) {
        foldChanged = true;
      }
    }
    const requiredUpdate =
      stateChanged ||
      foldChanged ||
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
