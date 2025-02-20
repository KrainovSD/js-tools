/* eslint-disable */
import plugin from "@krainovsd/eslint-presets";

export default [
  ...plugin.configs.common,
  ...plugin.configs.typescript,
  ...plugin.configs.testing,
  {
    ignores: ["rollup.config.ts"],
    rules: {
      "no-empty-function": "off",
      "no-empty": "off",
      "prefer-const": ["error", { destructuring: "all" }],
      "import/no-extraneous-dependencies": "off",
    },
  },
];
