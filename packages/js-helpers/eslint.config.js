import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.testing,
  ...plugin.presets.common,
  ...plugin.presets.typescript,
  {
    ignores: ["rollup.config.ts"],
    rules: {},
  },
];
