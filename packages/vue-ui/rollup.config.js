import { presets } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

const preset = presets.configs.types({ input: "./tmp/index.d.ts", output: "./lib/index.d.ts" });

export default defineConfig({
  input: preset.input,
  output: preset.output,
  plugins: preset.plugins,
});
