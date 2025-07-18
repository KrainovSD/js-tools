import tsPlugin from "typescript-eslint";
import plugin from "./lib/eslint/esm/index.js";

export default tsPlugin.config(...plugin.presets.typescript, {
  ignores: ["tmp/", "node_modules/", "lib/", "src/typescript/", ".turbo/"],
});
