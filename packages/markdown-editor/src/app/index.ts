import { languages } from "@codemirror/language-data";
import type { ThemeOptions } from "@/extensions";
import { Editor, type MultiCursorOptions } from "@/module";
import "./global.css";
import { COMMON_TEST, FULL_EXAMPLE, STRESS_TEST, randomColor, randomString } from "./helpers";

// let first = true;
/** Multi Cursor Mode */
const roomId = window.location.href.replace(window.location.origin, "").replace("/", "");
const presetMultiCursor: MultiCursorOptions = {
  roomId: `${roomId}/main/Readme.md`,
  url: "ws://192.168.135.150:4007/ws/v1/editor",
  userName: randomString(5),
  userColor: randomColor(),
  onChangeStatusProvider: (status) => {
    // eslint-disable-next-line no-console
    console.log(status);

    // if (first) {
    //   provider.disconnect();
    //   first = false;
    //   provider.connect();
    // }
  },
};

let editor: Editor | undefined;
let multiCursor: MultiCursorOptions | undefined = roomId ? presetMultiCursor : undefined;
let readonly: boolean = false;
const dark: ThemeOptions | undefined = undefined;
const light: ThemeOptions | undefined = undefined;
const viewFullExample = false;
const viewStressTest = false;
const root = document.querySelector<HTMLElement>("#root");
if (!root) throw new Error("Hasn't root");

function initEditor() {
  if (!root) return;

  editor = new Editor({
    root,
    multiCursor,
    initialText: viewStressTest ? STRESS_TEST : viewFullExample ? FULL_EXAMPLE : COMMON_TEST,
    vimMode: false,
    readonly,
    dark,
    light,
    theme: "dark",
    languages,
    imageSrcGetter: (url) => {
      return url;
    },
    autoCompleteTagOptions: Array.from({ length: 100 }, () => randomString(10)),
    autoCompleteConfig: {
      closeOnBlur: true,
    },
    keyMaps: [],
    defaultKeyMaps: {
      theme: true,
      vim: true,
    },
    // onBlur: () => {
    //   console.log("blur");
    // },
    // onFocus: () => {
    //   console.log("focus");
    // },
    // onChange: () => {
    //   console.log("change");
    // },
    onEnter: () => {
      return true;
    },
    onEscape: (view) => {
      view.contentDOM.blur();

      return true;
    },
  });
}

{
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
}

{
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
}

{
  const stateButton = document.querySelector(".state");
  let created = true;

  if (stateButton) {
    const text: Record<string, string> = {
      false: "Создать редактор",
      true: "Очистить редактор",
    };
    stateButton.textContent = text[String(Boolean(created))];
    stateButton.addEventListener("click", () => {
      if (!editor) return;

      if (created) editor.destroy();
      if (!created) initEditor();

      created = !created;
      stateButton.textContent = text[String(Boolean(created))];
    });
  }
}

{
  const replaceButton = document.querySelector(".replace");
  if (replaceButton) {
    replaceButton.addEventListener("click", () => {
      if (!editor) return;

      const content = Array.from({ length: 20 }, () => {
        return randomString(20);
      }).join("\n");

      editor.replaceContent(content);
    });
  }
}

initEditor();
