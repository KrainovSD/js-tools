import { type Decorator, setup } from "@storybook/vue3";
import { h } from "vue";
import { THEME_COLORS } from "../src/configs/preferences.constants";
import ThemeProvider from "../src/providers/ThemeProvider.vue";
import "./global.css";

setup(() => {});

const layout: Decorator = (storyFn, context) => {
  const story = storyFn();

  return () =>
    h(
      ThemeProvider,
      { theme: "light", themeConfig: THEME_COLORS, fontSize: 14 },
      { default: () => h(story, context.args) },
    );
};

export const decorators = [layout];
