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
  {
    input: "./src/transport.ts",
    output: [
      {
        file: "./lib/cjs/transport.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: false,
      },
      {
        file: "./lib/esm/transport.js",
        format: "esm",
        generatedCode: "es2015",
        sourcemap: false,
      },
    ],
    plugins: [
      presets.plugins.externals({ includeDependencies: true }),
      presets.plugins.typescript(),
      presets.plugins.json(),
      presets.plugins.nodeResolver(),
      presets.plugins.commonJS(),
    ],
  },
]);
