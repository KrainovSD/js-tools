import { type Range, StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { findMatches, getCharCodes, updateMatches } from "./search-lib";
import { SEARCH_CLASSES, type SearchMatch, type SearchStateType } from "./search-model";

export const setSearchEffect = StateEffect.define<string>();
export const gotoSearchEffect = StateEffect.define<number>();

const emptyState: SearchStateType = {
  query: "",
  codes: [],
  matches: [],
  index: -1,
};

export const SearchState = StateField.define<SearchStateType>({
  create: () => emptyState,

  update: (value, tr) => {
    let next = value;
    let queryChanged = false;
    for (const effect of tr.effects) {
      if (effect.is(setSearchEffect)) {
        const query = effect.value;
        const codes = getCharCodes(query);
        const matches = findMatches(tr.state.doc, codes);
        next = { query, codes, matches, index: matches.length ? 0 : -1 };
        queryChanged = true;
      } else if (effect.is(gotoSearchEffect) && next.matches.length) {
        const count = next.matches.length;
        next = { ...next, index: ((effect.value % count) + count) % count };
      }
    }
    if (tr.docChanged && next.query && !queryChanged) {
      const activeFrom = next.index >= 0 ? tr.changes.mapPos(next.matches[next.index].from) : -1;
      const matches = updateMatches(tr.changes, tr.state.doc, next.codes, next.matches);
      next = { ...next, matches, index: nearestIndex(matches, activeFrom) };
    }
    return next;
  },

  provide: (field) => EditorView.decorations.from(field, buildDecorations),
});

function buildDecorations(state: SearchStateType): DecorationSet {
  if (!state.matches.length) return Decoration.none;
  const decorations: Range<Decoration>[] = [];
  for (let index = 0; index < state.matches.length; index++) {
    const { from, to } = state.matches[index];
    decorations.push(
      Decoration.mark({
        class:
          index === state.index
            ? `${SEARCH_CLASSES.match} ${SEARCH_CLASSES.matchActive}`
            : SEARCH_CLASSES.match,
      }).range(from, to),
    );
  }
  return Decoration.set(decorations, true);
}

function nearestIndex(matches: SearchMatch[], position: number): number {
  if (!matches.length) return -1;
  for (let index = 0; index < matches.length; index++) {
    if (matches[index].from >= position) return index;
  }
  return matches.length - 1;
}
