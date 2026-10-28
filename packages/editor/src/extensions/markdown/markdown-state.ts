import { foldEffect, syntaxTree, unfoldEffect } from "@codemirror/language";
import {
  type EditorState,
  type Extension,
  type Range,
  StateEffect,
  StateField,
} from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, ViewPlugin } from "@codemirror/view";
import { randomString, saveDispatch } from "@/lib/utils";
import type { MarkdownOptions, MarkdownStateType } from "./markdown-model";
import { getTreeIndex } from "./markdown-tree-index";
import { fillMermaidStateDecorations } from "./mermaid/mermaid-decoration";
import { DEFAULT_MERMAID_SETTINGS, type MermaidSettings } from "./mermaid/mermaid-model";
import { fillTableStateDecorations } from "./table/table-decoration";

const setFocusEffect = StateEffect.define<boolean>();
const setMermaidSettingsEffect = StateEffect.define<MermaidSettings>();

export function NewState(markdownOptions: MarkdownOptions | undefined): Extension[] {
  const mermaid: MermaidSettings = {
    config: markdownOptions?.mermaid,
    emptyLabel: markdownOptions?.mermaidEmptyLabel ?? DEFAULT_MERMAID_SETTINGS.emptyLabel,
    errorLabel: markdownOptions?.mermaidErrorLabel ?? DEFAULT_MERMAID_SETTINGS.errorLabel,
  };

  return [
    MarkdownState,
    EditorView.focusChangeEffect.of((_state, focusing) => setFocusEffect.of(focusing)),
    ViewPlugin.define((view) => {
      saveDispatch(() => view.dispatch({ effects: [setMermaidSettingsEffect.of(mermaid)] }));
      return {};
    }),
  ];
}

export const MarkdownState = StateField.define<MarkdownStateType>({
  create: (state) => ({
    uniqueId: randomString(10),
    mermaid: DEFAULT_MERMAID_SETTINGS,
    focused: false,
    decorations: buildDecorations(state, false, DEFAULT_MERMAID_SETTINGS),
    getHeaders: (state, ensure) => getTreeIndex(state, ensure).headers,
    getImages: (state, ensure) => getTreeIndex(state, ensure).images,
    getTables: (state, ensure) => getTreeIndex(state, ensure).tables,
    getHeaderAt: (state, from) => getTreeIndex(state).headersByFrom.get(from),
    getImageAt: (state, from) => getTreeIndex(state).imagesByFrom.get(from),
  }),

  update: (value, tr) => {
    let focused = value.focused;
    let mermaid = value.mermaid;
    let stateChanged = false;
    let foldChanged = false;
    for (const effect of tr.effects) {
      if (effect.is(setFocusEffect) && effect.value !== focused) {
        focused = effect.value;
        stateChanged = true;
      }
      if (effect.is(setMermaidSettingsEffect) && effect.value !== mermaid) {
        mermaid = effect.value;
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
    return {
      ...value,
      focused,
      mermaid,
      decorations: buildDecorations(tr.state, focused, mermaid),
    };
  },
  provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
});

function buildDecorations(
  state: EditorState,
  focused: boolean,
  mermaid: MermaidSettings,
): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  fillTableStateDecorations({ state, focused, decorations });
  fillMermaidStateDecorations({ state, focused, decorations, mermaid });
  return decorations.length ? Decoration.set(decorations, true) : Decoration.none;
}
