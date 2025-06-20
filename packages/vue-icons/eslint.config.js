import plugin from "@krainovsd/presets/eslint";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default [
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,
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
  ...plugin.plugins.prettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "no-underscore-dangle": "off",
    },
  },
  {
    ignores: [
      "tmp/",
      "node_modules/",
      "lib/",
      "src/typescript/",
      ".turbo/",
      "dist/",
      "storybook-static/",
    ],
  },
];
