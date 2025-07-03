import { presets } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig([
  presets.configs.library({
    input: "./src/index.ts",
    cjs: true,
    esm: true,
    singleton: false,
    compress: false,
    sourcemap: true,
    stats: DEV,
    withDeps: DEV,
  }),
  presets.configs.types({ input: "./tmp/index.d.ts", output: "./lib/index.d.ts" }),
]);
