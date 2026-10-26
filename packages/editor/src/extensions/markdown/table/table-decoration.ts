import { Decoration, EditorView } from "@codemirror/view";
import { utils } from "@/lib";
import type { StateDecorationOptions } from "../markdown-model";
import { getTreeIndex } from "../markdown-tree-index";
import { TableWidget } from "./table-widget";

export function fillTableStateDecorations(opts: StateDecorationOptions) {
  const { decorations, focused, state } = opts;
  const readonly = !state.facet(EditorView.editable);
  for (const table of getTreeIndex(state).tables) {
    if (!table.replaceable) continue;
    const showWidget =
      readonly ||
      !focused ||
      !utils.isInRange(state.selection.ranges, [table.triggerFrom, table.triggerTo]);
    if (!showWidget) continue;
    decorations.push(
      Decoration.replace({
        widget: new TableWidget(table, readonly),
        block: true,
        inclusiveEnd: table.to === state.doc.length ? false : undefined,
      }).range(table.from, table.to),
    );
  }
}
