import { historyKeymap, indentWithTab, standardKeymap } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { type EditorView, keymap } from "@codemirror/view";
import { yUndoManagerKeymap } from "y-codemirror.next";

export type InitKeyMapsOptions = {
  onEnter?: HandleEnterKeyMapEditorFunction;
  onEscape?: HandleEscapeKeyMapEditorFunction;
};

export type HandleEnterKeyMapEditorFunction = (view: EditorView) => boolean;
export type HandleEscapeKeyMapEditorFunction = (view: EditorView) => boolean;

export const initKeyMaps = ({
  onEnter,
  onEscape,
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

  if (onEscape) {
    extensions.push(
      keymap.of([
        {
          key: "Escape",
          run: (view) => {
            return onEscape(view);
          },
        },
      ]),
    );
  }

  if (multiCursorMode) {
    extensions.push(keymap.of(yUndoManagerKeymap));
  } else {
    extensions.push(keymap.of(historyKeymap));
  }

  return extensions;
};
