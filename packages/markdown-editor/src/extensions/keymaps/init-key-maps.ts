import { indentWithTab, standardKeymap } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { type EditorView, keymap } from "@codemirror/view";
import { yUndoManagerKeymap } from "y-codemirror.next";
import { boldKeymap } from "./bold-keymap";
import { italicKeymap } from "./italic-keymap";
import { lineThroughKeymap } from "./line-through-keymap";
import { underlineKeymap } from "./underline-keymap";

export type InitKeyMapsOptions = {
  onEnter?: (view: EditorView) => boolean;
};

export const initKeyMaps = ({ onEnter }: InitKeyMapsOptions): Extension => {
  const extensions = [
    keymap.of(yUndoManagerKeymap),
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
    keymap.of(boldKeymap),
    keymap.of(italicKeymap),
    keymap.of(lineThroughKeymap),
    keymap.of(underlineKeymap),
  ];

  return extensions;
};
