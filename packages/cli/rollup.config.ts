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
          override: {
            file: "lib/index.js",
            dir: undefined,
            preserveModules: false,
            preserveModulesRoot: undefined,
          },
        },
      ],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: true } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: true },
        commonJS: { enabled: true },
        dts: { enabled: !DEV, input: "./tmp/index.d.ts", output: "./lib/index.d.ts" },
      },
    },
  ]),
);
