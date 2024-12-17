import { historyKeymap, indentWithTab, standardKeymap } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { type EditorView, type KeyBinding, drawSelection, keymap } from "@codemirror/view";
import { ThemeCompartment, VimModeCompartment } from "../compartments";
import { type EditorTheme, type ThemeOptions, getDarkTheme, getLightTheme } from "../theme";

export type InitKeyMapsOptions = {
  onEnter?: HandleEnterKeyMapEditorFunction;
  onEscape?: HandleEscapeKeyMapEditorFunction;
  keyMaps?: CustomKeyMap[];
  defaultKeyMaps?: DefaultKeyMapsOptions;
};

export type CustomKeyMap = KeyBinding;
export type HandleEnterKeyMapEditorFunction = (view: EditorView) => boolean;
export type HandleEscapeKeyMapEditorFunction = (view: EditorView) => boolean;
export type DefaultKeyMapsOptions = {
  vim?: boolean;
  theme?: boolean;
};

let vimMode = false;
let theme: EditorTheme = "light";

export const initKeyMaps = async ({
  onEnter,
  onEscape,
  multiCursorMode,
  keyMaps,
  defaultKeyMaps,
  theme: initialTheme,
  vimMode: initialVimMode,
  dark,
  light,
}: InitKeyMapsOptions & {
  multiCursorMode: boolean;
  vimMode: boolean;
  theme: EditorTheme;
  dark?: ThemeOptions;
  light?: ThemeOptions;
}): Promise<Extension> => {
  vimMode = initialVimMode;
  theme = initialTheme;

  /** tab */
  const keyBindings: CustomKeyMap[] = [indentWithTab];

  /** standard  */
  keyBindings.push(
    ...standardKeymap.map<CustomKeyMap>((keyMap) => {
      if (keyMap.key === "Enter" && onEnter) {
        return {
          key: "Enter",
          shift: keyMap.run,
          run: (view) => {
            const response = onEnter(view);

            if (response) keyMap.run?.(view);

            return response;
          },
        };
      }

      return keyMap;
    }),
  );

  /** vim */
  if (defaultKeyMaps?.vim)
    keyBindings.push({
      key: "Mod-Alt-v",
      run: (view) => {
        vimMode = !vimMode;

        void import("@replit/codemirror-vim").then(({ vim }) => {
          view.dispatch({
            effects: VimModeCompartment.reconfigure(
              vimMode ? [vim({ status: true }), drawSelection()] : [],
            ),
          });
        });

        return true;
      },
    });

  /** theme */
  if (defaultKeyMaps?.theme)
    keyBindings.push({
      key: "Mod-Alt-a",
      run: (view) => {
        theme = theme === "light" ? "dark" : "light";
        view.dispatch({
          effects: ThemeCompartment.reconfigure(
            theme === "dark"
              ? getDarkTheme({
                  dark,
                  light,
                  theme,
                })
              : getLightTheme({
                  dark,
                  light,
                  theme,
                }),
          ),
        });

        return true;
      },
    });

  /** escape */
  if (onEscape) {
    keyBindings.push({
      key: "Escape",
      run: (view) => {
        return onEscape(view);
      },
    });
  }

  /** custom */
  if (keyMaps) {
    keyBindings.push(...keyMaps);
  }

  /** history */
  if (multiCursorMode) {
    const { yUndoManagerKeymap } = await import("y-codemirror.next");
    keyBindings.push(...yUndoManagerKeymap);
  } else {
    keyBindings.push(...historyKeymap);
  }

  return keymap.of(keyBindings);
};
