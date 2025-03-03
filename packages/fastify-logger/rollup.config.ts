import { createRollupConfig } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig(
  createRollupConfig([
    {
      input: "./src/index.ts",
      outputs: [{ format: "es" }, { format: "cjs" }],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: !DEV } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: DEV },
        commonJS: { enabled: DEV },
        dts: { enabled: !DEV, input: "./tmp/index.d.ts", output: "./lib/index.d.ts" },
      },
    },
    {
      input: "./src/transport.ts",
      outputs: [
        {
          format: "cjs",
          override: {
            file: "./lib/cjs/transport.cjs",
            generatedCode: "es2015",
            sourcemap: true,
          },
        },
        {
          format: "es",
          override: {
            file: "./lib/esm/transport.js",
            format: "esm",
            generatedCode: "es2015",
            sourcemap: true,
          },
        },
      ],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: !DEV } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: DEV },
        commonJS: { enabled: DEV },
      },
    },
  ]),
);
