import { createRollupConfig } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig(
  createRollupConfig([
    {
      input: "./src/index.ts",
      outputs: [
        {
          format: "es",
          override: DEV
            ? {
                file: "./lib/esm/index.js",
                format: "es",
                generatedCode: "es2015",
                sourcemap: true,
              }
            : undefined,
        },
        { format: "cjs" },
      ],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: !DEV } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: DEV },
        commonJS: { enabled: DEV },
        dts: { enabled: !DEV, input: "./tmp/index.d.ts", output: "./lib/index.d.ts" },
      },
    },
  ]),
);
