import type { ThemeVariableConfig } from "../types";
import { extractThemeVariables } from "./extract-theme-variables";

type InjectThemeStyleOptions<T extends string> = {
  theme: T | undefined;
  fontSize: number | undefined;
  themeConfig: Record<T, ThemeVariableConfig> | undefined;
  target: HTMLElement;
};

export function injectThemeStyle<T extends string>(opts: InjectThemeStyleOptions<T>) {
  if (!opts.theme || !opts.themeConfig) return;

  opts.target.style.cssText += extractThemeVariables(opts.theme, opts.themeConfig);
  document.documentElement.style.cssText += `font-size: ${opts.fontSize}px;`;
}
