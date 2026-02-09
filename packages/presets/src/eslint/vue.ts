import type { Linter } from "eslint";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export const VUE_LINTER_PLUGINS = {
  vue: [
    ...eslintPluginVue.configs["flat/recommended"],
    {
      files: ["**/*.{ts,vue}"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: globals.browser,
        parserOptions: {
          parser: typescriptEslint.parser,
          extraFileExtensions: [".vue"],
        },
      },
    },
  ] as Linter.Config[],
  krainovVue: [
    {
      rules: {
        "vue/prop-name-casing": "off",
        "vue/multi-word-component-names": "off",
        "no-useless-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      },
    },
  ] as Linter.Config[],
};
