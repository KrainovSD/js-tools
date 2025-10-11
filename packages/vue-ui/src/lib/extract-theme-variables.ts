import type { ThemeVariableConfig } from "../types";

export function extractThemeVariables<T extends string>(
  theme: T,
  themesConfig: Record<T, ThemeVariableConfig>,
) {
  const themeConfig = themesConfig[theme];
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
  const custom = Object.entries(themeConfig.custom ?? {})
    .map(([key, value]) => (value != undefined ? `--${key}: ${value};` : ""))
    .filter((el) => el != "")
    .join(" ");

  return `${common} ${components} ${custom}`;
}
