/* eslint-disable no-console */
import { Editor } from "@/module";
import type { ThemeOptions } from "@/extensions/theme";
import { fullExample } from "./full-example";
import "./global.css";

let theme: "dark" | "light" = "dark";

const dark: ThemeOptions | undefined = undefined;
const light: ThemeOptions | undefined = undefined;

const viewFullExample = false;
const root = document.querySelector<HTMLElement>("#root");

if (!root) throw new Error("Hasn't root");

const editor = new Editor({
  root,
  initialText: viewFullExample
    ? fullExample
    : `just text

`,
  // onChange: (view) => {
  //   console.log(view.state.doc.toString());
  // },
  // onBlur: (state) => {
  //   console.log("blur ", state.doc.toString());
  // },
  // onFocus: (state) => {
  //   console.log("focus ", state.doc.toString());
  // },
  // onEnter: (view) => {
  //   console.log("enter ", view.state.doc.toString());
  // },
  vimMode: false,
  readonly: false,
  dark,
  light,
  theme,
});

const themeButton = document.createElement("button");
themeButton.textContent = "Сменить тему";
document.body.appendChild(themeButton);
themeButton.addEventListener("click", () => {
  editor.setTheme(theme === "light" ? "dark" : "light");
  theme = theme === "light" ? "dark" : "light";
});

let readonly = false;
const readonlyButton = document.createElement("button");
readonlyButton.textContent = "Сменить режим";
document.body.appendChild(readonlyButton);
readonlyButton.addEventListener("click", () => {
  editor.setReadonly(!readonly);
  readonly = !readonly;
});

let vimMode = false;
const vimButton = document.createElement("button");
vimButton.textContent = "Сменить vim режим";
document.body.appendChild(vimButton);
vimButton.addEventListener("click", () => {
  editor.setVimMode(!vimMode);
  vimMode = !vimMode;
});
