import { type HighlightConfig, type InitThemeOptions, type ThemeConfig } from "../theme-types";
import { getHighlightTemplate } from "./get-highlight-template";
import { getThemeTemplate } from "./get-theme-template";

const HIGHLIGHT_CONFIG: Required<HighlightConfig> = {
  keyword: "#9854f1",
  variable: "#3760bf",
  function: "#2e7de9",
  string: "#587539",
  constant: "#9854f1",
  type: "#07879d",
  class: "#3760bf",
  number: "#b15c00",
  comment: "#9da3c2",
  heading: "#006a83",
  invalid: "#ff3e64",
  regexp: "#2e5857",
};

const THEME_CONFIG: Required<ThemeConfig> = {
  background: "transparent",
  blockquoteColor: "#8A5CF5", // #6A8695
  codeBackground: "#e1e2e7",
  codeButtonBackground: "#CCCCCDFF",
  codeButtonColor: "#000000",
  codeColor: "#000000",
  color: "#000000",
  fontFamily: "Montserrat",
  horizontalColor: "#000000",
  linkColor: "#8A5CF5",
  mentionColor: "#8A5CF5",
  vimSelection: "#d9d9d9",
  vimSelectionFocused: "#d7d4f0",
  codeBlockBackground: "#e1e2e7",
  codeBlockBorderColor: "##CCCCCDFF",
};

export function getLightTheme({ light }: InitThemeOptions) {
  const highlightConfig = { ...HIGHLIGHT_CONFIG, ...(light?.highlightConfig || {}) };
  const themeConfig = { ...THEME_CONFIG, ...(light?.themeConfig || {}) };

  return [getThemeTemplate(false, themeConfig), getHighlightTemplate(highlightConfig)];
}
