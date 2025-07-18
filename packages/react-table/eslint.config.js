import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.react,
  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {
      "max-params": ["error", 4],
    },
  },
];
