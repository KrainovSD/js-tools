import { type ChangeSpec, type StateCommand } from "@codemirror/state";
import { type KeyBinding } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";

const TODO_MARK_RE = /^([ \t]{0,3}(?:[-+*]|\d+[.)])[ \t]{1,4})\[([ xX])\]([ \t]?)/;
const LIST_MARK_RE = /^([ \t]{0,3}(?:[-+*]|\d+[.)])[ \t]{1,4})/;
const PLAIN_PREFIX = "- [ ] ";

const toggleTodoMark: StateCommand = ({ state, dispatch }) => {
  const { from, to } = state.selection.main;
  const firstLine = state.doc.lineAt(from);
  const lastLine = state.doc.lineAt(to);
  const isRemove = TODO_MARK_RE.test(firstLine.text);
  const changes: ChangeSpec[] = [];
  let cursor: number | undefined;

  for (let number = lastLine.number; number >= firstLine.number; number--) {
    const line = state.doc.line(number);
    const todoMatch = TODO_MARK_RE.exec(line.text);
    if (isRemove) {
      if (!todoMatch) continue;
      changes.push({
        // from: line.from + todoMatch[1].length,
        from: line.from,
        to: line.from + todoMatch[0].length,
        insert: "",
      });
      continue;
    }
    if (todoMatch) continue;
    const listMatch = LIST_MARK_RE.exec(line.text);
    if (listMatch) {
      const from = line.from + listMatch[1].length;
      changes.push({ from, insert: "[ ] " });
      if (number === firstLine.number) cursor = from + "[ ] ".length;
    } else {
      changes.push({ from: line.from, insert: PLAIN_PREFIX });
      if (number === firstLine.number) cursor = line.from + PLAIN_PREFIX.length;
    }
  }
  if (!changes.length) return true;
  saveDispatch(() => {
    dispatch(
      state.update({
        changes,
        userEvent: "input",
        ...(from === to && cursor !== undefined ? { selection: { anchor: cursor } } : {}),
      }),
    );
  });
  return true;
};

export const todoKeymap: KeyBinding = {
  key: "Mod-Shift-x",
  run: toggleTodoMark,
};
