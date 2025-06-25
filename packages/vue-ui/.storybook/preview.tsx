import { DecoratorHelpers } from "@storybook/addon-themes";
import { type Decorator, setup } from "@storybook/vue3";
import { computed } from "vue";
import { THEME_COLORS } from "../src/configs/preferences.constants";
import ThemeProvider from "../src/providers/ThemeProvider.vue";
import type { ThemeName } from "../src/types";
import "./global.css";

setup(() => {});

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;
type ThemeDecoratorOptions<T extends Record<string, string>> = {
  themes: T;
  defaultTheme: keyof T;
};

const themeDecorator = <T extends Record<string, string>>({
  themes,
  defaultTheme,
}: ThemeDecoratorOptions<T>): Decorator => {
  initializeThemeState(Object.keys(themes), defaultTheme as string);

  return (story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const themeOverride = (context.parameters.theme ?? context.globals.theme) as string | undefined;

    const selected = themeOverride ?? selectedTheme ?? defaultTheme;

    function changeTheme() {
      const themeConfig = THEME_COLORS[selected as ThemeName];
      const common = Object.values(themeConfig.common)
        .map((type) =>
          Object.entries(type).map(([key, value]) =>
            value != undefined ? `--${key}: ${value};` : "",
          ),
        )
        .flat(2)
        .filter((el) => el != "")
        .join(" ");
      const components = Object.values(themeConfig.components)
        .map((type) =>
          Object.entries(type).map(([key, value]) =>
            value != undefined ? `--${key}: ${value};` : "",
          ),
        )
        .flat(2)
        .filter((el) => el != "")
        .join(" ");

      document.documentElement.style.cssText = `font-size: 14px; ${common} ${components} `;
    }

    changeTheme();

    return {
      components: { story, ThemeProvider },
      setup() {
        const theme = computed(() => selected);

        return {
          theme,
          THEME_COLORS,
        };
      },
      template: `<ThemeProvider :theme="theme" :theme-config="THEME_COLORS" :font-size="14">
                      <story />
                </ThemeProvider>`,
    };
  };
};

export const decorators = [
  themeDecorator({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
];
