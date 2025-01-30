import { type HighlightConfig, type InitThemeOptions, type ThemeConfig } from "../theme-types";
import { getHighlightTemplate } from "./get-highlight-template";
import { getThemeTemplate } from "./get-theme-template";

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
  horizontalColor: "#DDDDDD",
  linkColor: "#8A5CF5",
  mentionColor: "#8A5CF5",
  vimSelection: "#1A1919FF",
  vimSelectionFocused: "#2E4B4BFF",
};

export function getDarkTheme({ dark }: InitThemeOptions) {
  const highlightConfig = { ...HIGHLIGHT_CONFIG, ...(dark?.highlightConfig || {}) };
  const themeConfig = { ...THEME_CONFIG, ...(dark?.themeConfig || {}) };

  return [getThemeTemplate(true, themeConfig), getHighlightTemplate(highlightConfig)];
}
