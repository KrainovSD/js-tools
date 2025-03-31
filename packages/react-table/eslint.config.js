import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.react,
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,

  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {
      "@typescript-eslint/prefer-for-of": "off",
      "testing-library/render-result-naming-convention": "off",
    },
  },
];
