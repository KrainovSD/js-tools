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
    sourcemap: false,
    stats: DEV,
    withDeps: DEV,
  }),
  presets.configs.types({ input: "./tmp/index.d.ts", output: "./lib/index.d.ts" }),
]);
