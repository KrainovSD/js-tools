/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
const plugin = require("@krainovsd/eslint-presets");

module.exports = [
  ...plugin.configs.common,
  ...plugin.configs.typescript,

  {
    ignores: ["rollup.config.ts"],
    rules: {
      "prettier/prettier": ["error", { endOfLine: "lf" }, { usePrettierrc: true }],
    },
  },
];
