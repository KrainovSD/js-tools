import tsPlugin from "typescript-eslint";
import plugin from "./lib/eslint/esm/index.js";

export default tsPlugin.config(
  ...plugin.presets.react,
  ...plugin.presets.testing,
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,
  {
    ignores: ["rollup.config.js"],
    rules: {},
  },
);
