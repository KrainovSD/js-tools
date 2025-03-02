import tsPlugin from "typescript-eslint";
import plugin from "./lib/eslint/esm/index.js";

export default tsPlugin.config(
  ...plugin.presets.react,
  ...plugin.presets.testing,
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,
  {
    ignores: ["tmp/", "node_modules/", "lib/", "src/typescript/", ".turbo/"],
  },
);
