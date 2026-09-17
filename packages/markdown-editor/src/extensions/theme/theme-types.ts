export type Theme = "dark" | "light";

export type ThemeOptions = {
  dark?: ColorThemeOptions;
  light?: ColorThemeOptions;
};

export type ColorThemeOptions = {
  themeConfig?: ThemeConfig;
  highlightConfig?: HighlightConfig;
};

export type ThemeConfig = {
  fontFamily?: string;
  color?: string;
  background?: string;
  codeFontFamily?: string;
  codeBackground?: string;
  codeColor?: string;
  codeButtonColor?: string;
  codeButtonBackground?: string;
  horizontalColor?: string;
  linkColor?: string;
  blockquoteColor?: string;
  mentionColor?: string;
  vimSelectionFocused?: string;
  vimSelection?: string;
  codeBlockBorderColor?: string;
  codeBlockBackground?: string;
};

export type HighlightConfig = {
  keyword?: string;
  variable?: string;
  function?: string;
  string?: string;
  constant?: string;
  type?: string;
  class?: string;
  number?: string;
  comment?: string;
  heading?: string;
  invalid?: string;
  regexp?: string;
};
