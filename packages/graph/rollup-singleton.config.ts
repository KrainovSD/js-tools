import { presets } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

export default defineConfig([
  presets.configs.library({
    input: "./src/index.ts",
    cjs: false,
    esm: true,
    singleton: true,
    compress: true,
    sourcemap: false,
    stats: false,
    withDeps: true,
  }),
  presets.configs.types({ input: "./tmp/index.d.ts", output: "./lib/index.d.ts" }),
]);
