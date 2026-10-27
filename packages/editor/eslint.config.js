import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.vue,
  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: { loadTypeScriptPlugins: true },
      },
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "no-debugger": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    rules: {
      "new-cap": "off",
      "no-promise-executor-return": "off",
    },
  },
];
