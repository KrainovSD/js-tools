/* eslint-disable */
import plugin from "@krainovsd/eslint-presets";

export default [
  ...plugin.configs.common,
  ...plugin.configs.typescript,
  ...plugin.configs.testing,
  {
    ignores: ["rollup.config.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-plusplus": "off",

      "import/no-extraneous-dependencies": "off",
    },
  },
];
