import { syntaxTree } from "@codemirror/language";
import { Transaction } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";

export function requiredUpdate(v: Transaction | ViewUpdate): boolean {
  const treeChanged = syntaxTree(v.startState) !== syntaxTree(v.state);
  const editableChanged =
    v.startState.facet(EditorView.editable) !== v.state.facet(EditorView.editable);

  if (v instanceof Transaction) {
    return v.docChanged || v.selection != undefined || treeChanged || editableChanged;
  }
  if (v instanceof ViewUpdate) {
    return (
      v.docChanged ||
      v.viewportChanged ||
      v.selectionSet ||
      v.focusChanged ||
      treeChanged ||
      editableChanged
    );
  }
  return true;
}
