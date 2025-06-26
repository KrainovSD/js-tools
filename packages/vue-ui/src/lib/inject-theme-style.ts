import type { ThemeVariableConfig } from "../types";

type InjectThemeStyleOptions<T extends string> = {
  theme: T | undefined;
  fontSize: number | undefined;
  themeConfig: Record<T, ThemeVariableConfig> | undefined;
};

export function injectThemeStyle<T extends string>(opts: InjectThemeStyleOptions<T>) {
  if (!opts.theme || !opts.themeConfig) return;

  const themeConfig = opts.themeConfig[opts.theme];
  const common = Object.values(themeConfig.common)
    .map((type) =>
      Object.entries(type).map(([key, value]) => (value != undefined ? `--${key}: ${value};` : "")),
    )
    .flat(2)
    .filter((el) => el != "")
    .join(" ");
  const components = Object.values(themeConfig.components)
    .map((type) =>
      Object.entries(type).map(([key, value]) => (value != undefined ? `--${key}: ${value};` : "")),
    )
    .flat(2)
    .filter((el) => el != "")
    .join(" ");

  document.documentElement.style.cssText = `font-size: ${opts.fontSize}px; ${common} ${components}`;
}
