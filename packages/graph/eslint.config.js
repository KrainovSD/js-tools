/* eslint-disable */
import plugin from "@krainovsd/eslint-presets";

export default [
  ...plugin.configs.common,
  ...plugin.configs.typescript,

  {
    ignores: ["rollup.config.ts"],
    rules: {
      "import/no-extraneous-dependencies": "off",
      "no-empty": "off",
      "prettier/prettier": ["error", { endOfLine: "lf" }, { usePrettierrc: true }],
    },
  },
];
