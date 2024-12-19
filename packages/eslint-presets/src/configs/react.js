/* eslint-disable */
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import testingPlugin from "eslint-plugin-testing-library";

export default [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  jsxA11yPlugin.flatConfigs.recommended,
  testingPlugin.configs["flat/react"],
  testingPlugin.configs["flat/dom"],
];
