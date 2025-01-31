import { EditorSelection, type StateCommand, Text, Transaction } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";

const insertLineThroughMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isHasBefore = state.sliceDoc(range.from - 2, range.from) === "~~";
    const isHasAfter = state.sliceDoc(range.to, range.to + 2) === "~~";

    const changes = [];

    changes.push(
      isHasBefore
        ? {
            from: range.from - 2,
            to: range.from,
            insert: Text.of([""]),
          }
        : {
            from: range.from,
            insert: Text.of(["~~"]),
          },
    );

    changes.push(
      isHasAfter
        ? {
            from: range.to,
            to: range.to + 2,
            insert: Text.of([""]),
          }
        : {
            from: range.to,
            insert: Text.of(["~~"]),
          },
    );

    const extendBefore = isHasBefore ? -2 : 2;
    const extendAfter = isHasAfter ? -2 : 2;

    return {
      changes,
      range: EditorSelection.range(range.from + extendBefore, range.to + extendAfter),
    };
  });

  saveDispatch(() => {
    dispatch(
      state.update(changes, {
        scrollIntoView: true,
        annotations: Transaction.userEvent.of("input"),
      }),
    );
  });

  return true;
};

export const lineThroughKeymap: KeyBinding[] = [
  {
    key: "Mod-Alt-x",
    run: insertLineThroughMarker,
  },
];
