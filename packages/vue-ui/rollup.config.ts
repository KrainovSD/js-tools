import { createRollupConfig } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";
import vue from "rollup-plugin-vue";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig(
  createRollupConfig([
    {
      input: "./src/index.ts",
      outputs: [{ format: "es" }, { format: "cjs" }],
      plugins: {
        start: [vue({ compilerOptions: {} })],
        externals: { enabled: true, override: { includeDependencies: !DEV } },
        typescript: { enabled: true, override: { tsconfig: "./tsconfig.build.json" } },
        json: { enabled: true },
        postCSS: { enabled: true },
        nodeResolver: { enabled: DEV },

        commonJS: { enabled: DEV },
        dts: { enabled: !DEV, input: "./tmp/index.d.ts", output: "./lib/index.d.ts" },
      },
    },
  ]),
);
