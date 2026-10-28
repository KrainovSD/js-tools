import { Decoration, EditorView } from "@codemirror/view";
import { utils } from "@/lib";
import type { StateDecorationOptions } from "../markdown-model";
import { getTreeIndex } from "../markdown-tree-index";
import type { MermaidSettings } from "./mermaid-model";
import { MermaidWidget } from "./mermaid-widget";

export function fillMermaidStateDecorations(
  opts: StateDecorationOptions & { mermaid: MermaidSettings },
) {
  const { decorations, focused, state, mermaid: mermaidSettings } = opts;
  const readonly = !state.facet(EditorView.editable);
  for (const mermaid of getTreeIndex(state).mermaids) {
    if (!mermaid.replaceable) continue;
    const showWidget =
      readonly ||
      !focused ||
      !utils.isInRange(state.selection.ranges, [mermaid.triggerFrom, mermaid.triggerTo]);
    if (!showWidget) continue;
    decorations.push(
      Decoration.replace({
        widget: new MermaidWidget(mermaid.source, mermaidSettings),
        block: true,
        inclusiveEnd: mermaid.to === state.doc.length ? false : undefined,
      }).range(mermaid.from, mermaid.to),
    );
  }
}
