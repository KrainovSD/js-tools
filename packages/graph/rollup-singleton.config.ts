import { createRollupConfig } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

export default defineConfig(
  createRollupConfig([
    {
      input: "./src/index.ts",
      outputs: [
        {
          format: "es",
          override: {
            file: "./dist/index.js",
            format: "es",
            generatedCode: "es2015",
            sourcemap: true,
          },
        },
      ],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: false } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: true },
        commonJS: { enabled: true },
        terser: { enabled: true },
        dts: { enabled: true, input: "./tmp/index.d.ts", output: "./dist/index.d.ts" },
      },
    },
  ]),
);
