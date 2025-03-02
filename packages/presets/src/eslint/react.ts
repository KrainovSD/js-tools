import type { Linter } from "eslint";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import testingPlugin from "eslint-plugin-testing-library";

export const REACT_LINTER_PLUGINS = {
  react: [
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      ...reactPlugin.configs.flat?.recommended,
    },
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      ...reactPlugin.configs.flat?.["jsx-runtime"],
    },
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ] as Linter.Config[],
  reactHooks: [
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      plugins: {
        "react-hooks": reactHooksPlugin,
      },
      rules: { ...reactHooksPlugin.configs["recommended-latest"].rules },
    },
  ] as Linter.Config[],
  a11y: [
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      plugins: {
        "jsx-a11y": jsxA11yPlugin,
      },
      rules: { ...jsxA11yPlugin.flatConfigs.recommended.rules },
    },
  ] as Linter.Config[],
  testingReact: [
    testingPlugin.configs["flat/react"],
    testingPlugin.configs["flat/dom"],
  ] as Linter.Config[],
};

export default [
  ...REACT_LINTER_PLUGINS.react,
  ...REACT_LINTER_PLUGINS.reactHooks,
  ...REACT_LINTER_PLUGINS.a11y,
  ...REACT_LINTER_PLUGINS.testingReact,
] as Linter.Config[];
