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
      "max-params": ["error", 4],
      "vue/prop-name-casing": "off",
    },
  },
];
