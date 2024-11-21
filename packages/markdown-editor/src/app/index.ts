/* eslint-disable no-console */
import { Editor } from "../module";
import "./global.css";

const root = document.querySelector<HTMLElement>("#root");

if (!root) throw new Error("Hasn't root");

const editor = new Editor({
  root,
  initialText: `# test
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
});

let theme: "dark" | "light" = "light";
const button = document.createElement("button");
button.textContent = "Сменить тему";
document.body.appendChild(button);
button.addEventListener("click", () => {
  editor.setTheme(theme === "light" ? "dark" : "light");
  theme = theme === "light" ? "dark" : "light";
});
