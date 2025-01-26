const plugin = require("@krainovsd/eslint-presets");

module.exports = [
  ...plugin.configs.common,
  ...plugin.configs.typescript,

  {
    ignores: ["rollup.config.ts"],
    rules: {
      "@typescript-eslint/require-await": "off",
      "import/no-extraneous-dependencies": "off",
      "no-empty": "off",
      "prettier/prettier": ["error", { endOfLine: "lf" }, { usePrettierrc: true }],
    },
  },
];
