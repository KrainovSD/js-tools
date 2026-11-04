import { type EditorState, type Extension } from "@codemirror/state";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";

function formatRelativeLineNumber(lineNumber: number, state: EditorState): string {
  const cursorLineNumber = state.doc.lineAt(state.selection.main.head).number;
  return String(
    lineNumber === cursorLineNumber ? lineNumber : Math.abs(lineNumber - cursorLineNumber),
  );
}

export function NewLineNumbers(): Extension {
  return [lineNumbers({ formatNumber: formatRelativeLineNumber }), highlightActiveLineGutter()];
}
