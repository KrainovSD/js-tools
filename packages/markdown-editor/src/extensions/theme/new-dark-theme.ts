import type { Extension } from "@codemirror/state";
import { NewHighlightTemplate } from "./new-highlight-template";
import { NewThemeTemplate } from "./new-theme-template";
import { type ColorThemeOptions, type HighlightConfig, type ThemeConfig } from "./theme-types";

const HIGHLIGHT_CONFIG: Required<HighlightConfig> = {
  keyword: "#f97583",
  variable: "#ffab70",
  function: "#79b8ff",
  string: "#9ecbff",
  constant: "#79b8ff",
  type: "#79b8ff",
  class: "#b392f0",
  number: "#79b8ff",
  comment: "#6a737d",
  heading: "#79b8ff",
  invalid: "#f97583",
  regexp: "#9ecbff",
};

const THEME_CONFIG: Required<ThemeConfig> = {
  background: "#2E3235",
  blockquoteColor: "#8A5CF5", // #6A8695
  codeBackground: "#24292e",
  codeButtonBackground: "#434C54FF",
  codeButtonColor: "#DDDDDD",
  codeColor: "#DDDDDD",
  color: "#DDDDDD",
  fontFamily: "Montserrat",
  codeFontFamily: "Consolas",
  horizontalColor: "#DDDDDD",
  linkColor: "#8A5CF5",
  mentionColor: "#8A5CF5",
  vimSelection: "#1A1919FF",
  vimSelectionFocused: "#2E4B4BFF",
  codeBlockBorderColor: "#7b7e81",
  codeBlockBackground: "#24292e",
};

export function NewDarkTheme(opts: ColorThemeOptions | undefined): Extension {
  const highlightConfig = { ...HIGHLIGHT_CONFIG, ...(opts?.highlightConfig ?? {}) };
  const themeConfig = { ...THEME_CONFIG, ...(opts?.themeConfig ?? {}) };
  return [NewThemeTemplate(true, themeConfig), NewHighlightTemplate(highlightConfig)];
}
