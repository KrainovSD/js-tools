import { syntaxTree } from "@codemirror/language";
import type { EditorState, Extension, Range } from "@codemirror/state";
import { StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import type { Tree } from "@lezer/common";
import { utils } from "@/lib";
import { getTables } from "./table-lib";
import { type TableMode, type TableModel, setFocusEffect, setTableModeEffect } from "./table-model";
import { TableWidget } from "./table-widget";

type TableState = {
  mode: TableMode;
  focused: boolean;
  decorations: DecorationSet;
};

export function tableExtension(mode: TableMode): Extension[] {
  const tablesCache = new WeakMap<Tree, TableModel[]>();
  const tableStateField = StateField.define<TableState>({
    create: (state) => ({
      mode,
      focused: false,
      decorations: buildTableDecorations(state, mode, false, tablesCache),
    }),
    update: (value, tr) => {
      let mode = value.mode;
      let focused = value.focused;
      let stateChanged = false;

      for (const effect of tr.effects) {
        if (effect.is(setTableModeEffect) && effect.value !== mode) {
          mode = effect.value;
          stateChanged = true;
        } else if (effect.is(setFocusEffect) && effect.value !== focused) {
          focused = effect.value;
          stateChanged = true;
        }
      }

      const needsUpdate =
        stateChanged ||
        tr.docChanged ||
        tr.selection !== undefined ||
        syntaxTree(tr.startState) !== syntaxTree(tr.state) ||
        tr.startState.facet(EditorView.editable) !== tr.state.facet(EditorView.editable);
      if (!needsUpdate) return value;

      return {
        mode,
        focused,
        decorations: buildTableDecorations(tr.state, mode, focused, tablesCache),
      };
    },
    provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
  });

  return [
    tableStateField,
    EditorView.focusChangeEffect.of((_state, focusing) => setFocusEffect.of(focusing)),
  ];
}

function buildTableDecorations(
  state: EditorState,
  mode: TableMode,
  focused: boolean,
  cache: WeakMap<Tree, TableModel[]>,
): DecorationSet {
  const isReadonly = !state.facet(EditorView.editable);
  const ranges: Range<Decoration>[] = [];

  for (const table of getTables(state, cache)) {
    if (!table.replaceable) continue;
    const showWidget =
      mode === "editor" ||
      isReadonly ||
      !focused ||
      !utils.isInRange(state.selection.ranges, [table.triggerFrom, table.triggerTo]);
    if (!showWidget) continue;

    ranges.push(
      Decoration.replace({
        widget: new TableWidget(table, mode, isReadonly, cache),
        block: true,
        inclusiveEnd: table.to === state.doc.length ? false : undefined,
      }).range(table.from, table.to),
    );
  }
  return ranges.length ? Decoration.set(ranges, true) : Decoration.none;
}
