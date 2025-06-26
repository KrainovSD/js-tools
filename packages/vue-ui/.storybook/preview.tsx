import { DecoratorHelpers } from "@storybook/addon-themes";
import { type Decorator, setup } from "@storybook/vue3";
import { computed } from "vue";
import { THEME_CONFIG } from "../src/constants";
import { injectThemeStyle } from "../src/lib/inject-theme-style";
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

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions
    const selected = themeOverride || selectedTheme || defaultTheme;

    injectThemeStyle({ fontSize: 14, theme: selected as ThemeName, themeConfig: THEME_CONFIG });
    document.documentElement.style.cssText += `background: var(--ksd-bg-color); color: var(--ksd-text-main-color); position: relative; min-width: 100vw; min-height: 100vh;`;

    return {
      components: { story, ThemeProvider },
      setup() {
        const theme = computed(() => selected);

        return {
          theme,
        };
      },
      template: `<ThemeProvider>
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
