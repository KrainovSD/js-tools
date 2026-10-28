import type { Extension } from "@codemirror/state";
import { vsCodeDark } from "@fsegurai/codemirror-theme-vscode-dark";
import { vsCodeLight } from "@fsegurai/codemirror-theme-vscode-light";
import { ref, watch } from "vue";

export type IAppTheme = "dark" | "light";

export const APP_THEMES: IAppTheme[] = ["dark", "light"];

export const EDITOR_THEMES: Record<IAppTheme, Extension> = {
  dark: vsCodeDark,
  light: vsCodeLight,
};

export const THEME_LABELS: Record<IAppTheme, string> = {
  dark: "Тёмная",
  light: "Светлая",
};

export function useTheme() {
  const theme = ref<IAppTheme>("dark");

  watch(
    theme,
    (value) => {
      document.documentElement.style.colorScheme = value;
      document.documentElement.style.setProperty(
        "--ksd-cm-mermaid-filter",
        value === "dark" ? "invert(1) hue-rotate(180deg)" : "",
      );
    },
    { immediate: true },
  );

  return { theme };
}
