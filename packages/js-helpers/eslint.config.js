import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.typescript,
  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {
      "no-bitwise": "off",
    },
  },
];
