import { EditorSelection, type StateCommand, Text, Transaction } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";

const insertItalicMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const checkItalicBefore = () => {
      let index = 1;
      let step = 0;

      while (
        state.sliceDoc(range.from - index, range.from - step) === "*" ||
        state.sliceDoc(range.from - index, range.from - step) === "_"
      ) {
        index += 1;
        step += 1;
      }

      return step % 2 !== 0;
    };

    const checkItalicAfter = () => {
      let index = 1;
      let step = 0;

      while (
        state.sliceDoc(range.to + step, range.to + index) === "*" ||
        state.sliceDoc(range.to + step, range.to + index) === "_"
      ) {
        index += 1;
        step += 1;
      }

      return step % 2 !== 0;
    };

    const isItalicBefore = checkItalicBefore();
    const isItalicAfter = checkItalicAfter();

    const changes = [];

    changes.push(
      isItalicBefore
        ? {
            from: range.from - 1,
            to: range.from,
            insert: Text.of([""]),
          }
        : {
            from: range.from,
            insert: Text.of(["*"]),
          },
    );

    changes.push(
      isItalicAfter
        ? {
            from: range.to,
            to: range.to + 1,
            insert: Text.of([""]),
          }
        : {
            from: range.to,
            insert: Text.of(["*"]),
          },
    );

    const extendBefore = isItalicBefore ? -1 : 1;
    const extendAfter = isItalicAfter ? -1 : 1;

    return {
      changes,
      range: EditorSelection.range(range.from + extendBefore, range.to + extendAfter),
    };
  });

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of("input"),
    }),
  );

  return true;
};

export const italicKeymap: KeyBinding[] = [
  {
    key: "Mod-i",
    run: insertItalicMarker,
  },
];
