/* eslint-disable */
import plugin from "@krainovsd/eslint-presets";

export default [
  ...plugin.configs.common,
  ...plugin.configs.typescript,
  ...plugin.configs.testing,
  {
    ignores: ["rollup.config.ts"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
];
