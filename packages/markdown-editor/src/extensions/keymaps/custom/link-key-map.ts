import type { ChangeSpec, StateCommand } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import { saveDispatch } from "@/lib/utils";

const insertLinkWrapper: StateCommand = ({ state, dispatch }) => {
  const changes: ChangeSpec[] = [];
  const { from, to } = state.selection.ranges[0];
  if (from === to) return true;
  const content = state.sliceDoc(from, to);

  const wrapper = `[${content}]()`;
  changes.push({ from, to, insert: wrapper });

  saveDispatch(() => {
    dispatch(
      state.update({
        changes,
        selection: {
          anchor: to + 3,
        },
      }),
    );
  });

  return true;
};

export const linkKeymap: KeyBinding = {
  key: "Mod-k",
  run: insertLinkWrapper,
};
