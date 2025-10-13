import plugins from "@krainovsd/presets/eslint";

export default [
  ...plugins.presets.vue,
  {
    ignores: [
      "tmp/",
      "node_modules/",
      "lib/",
      "src/typescript/",
      ".turbo/",
      "dist/",
      "storybook-static/",
    ],
  },
  {
    rules: {
      camelcase: "off",
      "max-params": "off",
    },
  },
];
