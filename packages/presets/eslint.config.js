import tsPlugin from "typescript-eslint";
import plugin from "./lib/presets/lib/esm/index.js";

export default tsPlugin.config(
  ...plugin.configs.react,
  ...plugin.configs.testing,
  ...plugin.configs.common,
  ...plugin.configs.typescript,
  {
    ignores: ["rollup.config.js"],
  },
);
