import { languages } from "@codemirror/language-data";
import { Editor, type MultiCursorOptions } from "@/module";
import type { ThemeOptions } from "@/extensions/theme";
import "./global.css";
import { COMMON_TEST, FULL_EXAMPLE, STRESS_TEST, randomColor, randomString } from "./helpers";

/** Multi Cursor Mode */
const roomId = window.location.href.replace(window.location.origin, "").replace("/", "");
const presetMultiCursor: MultiCursorOptions = {
  roomId,
  url: "ws://192.168.135.150:3001",
  userName: randomString(5),
  userColor: randomColor(),
};

let editor: Editor | undefined;
let theme: "dark" | "light" = "dark";
let multiCursor: MultiCursorOptions | undefined = roomId ? presetMultiCursor : undefined;
let readonly: boolean = false;
let vimMode: boolean = false;
const dark: ThemeOptions | undefined = undefined;
const light: ThemeOptions | undefined = undefined;
const viewFullExample = true;
const viewStressTest = false;
const root = document.querySelector<HTMLElement>("#root");
if (!root) throw new Error("Hasn't root");

function initEditor() {
  if (!root) return;

  editor = new Editor({
    root,
    multiCursor,
    // eslint-disable-next-line no-nested-ternary
    initialText: viewStressTest ? STRESS_TEST : viewFullExample ? FULL_EXAMPLE : COMMON_TEST,
    vimMode,
    readonly,
    dark,
    light,
    theme,
    languages,
    // onBlur: () => {
    //   console.log("blur");
    // },
    // onFocus: () => {
    //   console.log("focus");
    // },
    // onChange: () => {
    //   console.log("change");
    // },
    // onEnter: () => {
    //   return false;
    // },
    onEscape: (view) => {
      view.contentDOM.blur();

      return true;
    },
  });
}

/** Theme Mode */
const themeButton = document.querySelector(".theme-mode");
if (themeButton) {
  const text = {
    dark: "Включить светлую тему",
    light: "Включить темную тему",
  };
  themeButton.textContent = text[theme];
  themeButton.addEventListener("click", () => {
    if (!editor) return;

    editor.setTheme(theme === "light" ? "dark" : "light");
    theme = theme === "light" ? "dark" : "light";
    themeButton.textContent = text[theme];
  });
}
/** Edit Mode */
const readonlyButton = document.querySelector(".edit-mode");
if (readonlyButton) {
  const text: Record<string, string> = {
    false: "Выключить режим редактирования",
    true: "Включить режим редактирования",
  };
  readonlyButton.textContent = text[String(readonly)];
  readonlyButton.addEventListener("click", () => {
    if (!editor) return;

    editor.setReadonly(!readonly);
    readonly = !readonly;
    readonlyButton.textContent = text[String(readonly)];
  });
}

/** Vim Mode */
const vimButton = document.querySelector(".vim-mode");
if (vimButton) {
  const text: Record<string, string> = {
    false: "Включить Vim",
    true: "Выключить Vim",
  };
  vimButton.textContent = text[String(vimMode)];
  vimButton.addEventListener("click", () => {
    if (!editor) return;

    editor.setVimMode(!vimMode);
    vimMode = !vimMode;
    vimButton.textContent = text[String(vimMode)];
  });
}

/** Multi Cursor Mode */
const multiButton = document.querySelector(".multi-mode");
if (multiButton) {
  const text: Record<string, string> = {
    false: "Включить совместный режим",
    true: "Выключить совместный режим",
  };
  multiButton.textContent = text[String(Boolean(multiCursor))];
  multiButton.addEventListener("click", () => {
    if (!editor) return;

    editor.destroy();

    if (!multiCursor) {
      if (!presetMultiCursor.roomId) presetMultiCursor.roomId = randomString(10);
      multiCursor = presetMultiCursor;
      window.history.pushState({}, "", `${window.location.origin}/${presetMultiCursor.roomId}`);
    } else {
      multiCursor = undefined;
      window.history.pushState({}, "", window.location.origin);
    }

    initEditor();

    multiButton.textContent = text[String(Boolean(multiCursor))];
  });
}

initEditor();
