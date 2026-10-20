import { type ChangeSpec, type StateCommand } from "@codemirror/state";
import { type KeyBinding } from "@codemirror/view";
import { utils } from "@/lib";
import { saveDispatch } from "@/lib/utils";

const ITALIC_MARK_STAR = "*".codePointAt(0);
const ITALIC_MARK_DASH = "_".codePointAt(0);
const SHIFT_COUPLE = 3;
const SHIFT_ALONE = 1;

const insertItalicMarker: StateCommand = ({ state, dispatch }) => {
  const changes: ChangeSpec[] = [];
  const { from, to } = state.selection.ranges[0];
  if (from === to) return true;

  const { end, start, marked, originalText } = utils.overlapMark({
    marks: [ITALIC_MARK_STAR, ITALIC_MARK_DASH],
    requireMatched: [SHIFT_ALONE, SHIFT_COUPLE],
    shift: SHIFT_COUPLE,
    state,
  });

  if (marked) {
    if (~start) {
      changes.push({ from: start, to: start + SHIFT_ALONE, insert: "" });
    }
    if (~end) {
      changes.push({ from: end, to: end + SHIFT_ALONE, insert: "" });
    }
  } else {
    const markedText = `*${originalText}*`;
    changes.push({ from, to, insert: markedText });
  }

  saveDispatch(() => {
    const startSelection = ~start ? start : from;
    const endSelection = ~end ? end - (~start ? SHIFT_ALONE : 0) : to - (~start ? SHIFT_ALONE : 0);

    dispatch(
      state.update({
        changes,
        selection: !marked
          ? {
              anchor: from + SHIFT_ALONE,
              head: to + SHIFT_ALONE,
            }
          : {
              anchor: startSelection,
              head: endSelection,
            },
      }),
    );
  });

  return true;
};

export const italicKeymap: KeyBinding = {
  key: "Mod-i",
  run: insertItalicMarker,
};
