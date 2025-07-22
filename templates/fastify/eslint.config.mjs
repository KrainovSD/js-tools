import eslint from "@krainovsd/presets/eslint";

export default [
  ...eslint.presets.typescript,
  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {},
  },
];
