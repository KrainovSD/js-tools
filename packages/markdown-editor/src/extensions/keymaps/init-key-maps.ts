import { historyKeymap, indentWithTab, standardKeymap } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { type EditorView, keymap } from "@codemirror/view";
import { yUndoManagerKeymap } from "y-codemirror.next";

export type InitKeyMapsOptions = {
  onEnter?: (view: EditorView) => boolean;
};

export const initKeyMaps = ({
  onEnter,
  multiCursorMode,
}: InitKeyMapsOptions & { multiCursorMode: boolean }): Extension => {
  const extensions = [
    keymap.of([indentWithTab]),
    keymap.of(
      standardKeymap.map((keyMap) => {
        if (keyMap.key === "Enter" && onEnter) {
          return {
            key: "Enter",
            shift: keyMap.run,
            run: (view) => {
              return onEnter(view);
            },
          };
        }

        return keyMap;
      }),
    ),
    // keymap.of(boldKeymap),
    // keymap.of(italicKeymap),
    // keymap.of(lineThroughKeymap),
    // keymap.of(underlineKeymap),
  ];

  if (multiCursorMode) {
    extensions.push(keymap.of(yUndoManagerKeymap));
  } else {
    extensions.push(keymap.of(historyKeymap));
  }

  return extensions;
};
