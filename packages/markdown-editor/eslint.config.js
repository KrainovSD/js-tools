import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.testing,
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,

  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
];
