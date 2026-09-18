import { type ChangeSpec, type StateCommand } from "@codemirror/state";
import { type KeyBinding } from "@codemirror/view";
import { utils } from "@/lib";
import { saveDispatch } from "@/lib/utils";

const CODE_MARK = "`".codePointAt(0);
const SHIFT = 1;

const insertCodeMarker: StateCommand = ({ state, dispatch }) => {
  const changes: ChangeSpec[] = [];
  const { from, to } = state.selection.ranges[0];
  if (from === to) return true;

  const { end, start, marked, originalText } = utils.overlapMark({
    marks: [CODE_MARK],
    requireMatched: [SHIFT],
    shift: SHIFT,
    state,
  });

  if (marked) {
    if (~start) {
      changes.push({ from: start, to: start + SHIFT, insert: "" });
    }
    if (~end) {
      changes.push({ from: end, to: end + SHIFT, insert: "" });
    }
  } else {
    changes.push({ from, to, insert: `\`${originalText}\`` });
  }

  saveDispatch(() => {
    const startSelection = ~start ? start : from;
    const endSelection = ~end ? end - (~start ? SHIFT : 0) : to - (~start ? SHIFT : 0);

    dispatch(
      state.update({
        changes,
        selection: !marked
          ? {
              anchor: from + SHIFT,
              head: to + SHIFT,
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

export const codeKeymap: KeyBinding = {
  key: "Mod-Alt-c",
  run: insertCodeMarker,
};
