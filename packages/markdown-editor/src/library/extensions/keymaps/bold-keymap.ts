import { EditorSelection, StateCommand, Text, Transaction } from "@codemirror/state";
import { KeyBinding } from "@codemirror/view";

const insertBoldMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isBoldBefore =
      state.sliceDoc(range.from - 2, range.from) === "**" ||
      state.sliceDoc(range.from - 2, range.from) === "__";
    const isBoldAfter =
      state.sliceDoc(range.to, range.to + 2) === "**" ||
      state.sliceDoc(range.from - 2, range.from) === "__";
    const changes = [];

    changes.push(
      isBoldBefore
        ? {
            from: range.from - 2,
            to: range.from,
            insert: Text.of([""]),
          }
        : {
            from: range.from,
            insert: Text.of(["**"]),
          },
    );

    changes.push(
      isBoldAfter
        ? {
            from: range.to,
            to: range.to + 2,
            insert: Text.of([""]),
          }
        : {
            from: range.to,
            insert: Text.of(["**"]),
          },
    );

    const extendBefore = isBoldBefore ? -2 : 2;
    const extendAfter = isBoldAfter ? -2 : 2;

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

export const boldKeymap: KeyBinding[] = [
  {
    key: "Mod-b",
    run: insertBoldMarker,
  },
];
