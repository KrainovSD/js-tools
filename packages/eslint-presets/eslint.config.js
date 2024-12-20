/* eslint-disable */
import plugin from "./lib/esm/index.js";
import tsPlugin from "typescript-eslint";

export default tsPlugin.config(
  ...plugin.configs.react,
  ...plugin.configs.testing,
  ...plugin.configs.common,
  ...plugin.configs.typescript,
  {
    ignores: ["rollup.config.js"],
  },
);
