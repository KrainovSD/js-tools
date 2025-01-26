/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
const plugin = require("@krainovsd/eslint-presets");

module.exports = [
  ...plugin.configs.common,
  ...plugin.configs.typescript,

  {
    ignores: ["rollup.config.ts"],
    rules: {
      "no-empty-function": "off",
      "import/no-extraneous-dependencies": "off",
      "no-empty": "off",
      "prettier/prettier": ["error", { endOfLine: "lf" }, { usePrettierrc: true }],
    },
  },
];
