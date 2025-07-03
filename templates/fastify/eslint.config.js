const plugin = require("@krainovsd/presets/eslint");

module.exports = [
  ...plugin.presets.typescript,
  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {},
  },
];
