import { createRollupConfig } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig(
  createRollupConfig([
    {
      input: ["./src/register-fastify-trace.ts", "./src/register-trace.ts"],
      outputs: [
        {
          format: "es",
          override: {
            dir: "./lib/esm",
            format: "esm",
            generatedCode: "es2015",
            preserveModules: true,
            sourcemap: true,
          },
        },
        {
          format: "cjs",
          override: {
            dir: "./lib/cjs",
            format: "cjs",
            generatedCode: "es2015",
            preserveModules: true,
            sourcemap: true,
            entryFileNames: (info) => {
              return `${info.name}.cjs`;
            },
          },
        },
      ],
      plugins: {
        externals: { enabled: true, override: { includeDependencies: !DEV } },
        typescript: { enabled: true },
        json: { enabled: true },
        nodeResolver: { enabled: DEV },
        commonJS: { enabled: DEV },
        dts: {
          enabled: !DEV,
          input: ["./tmp/register-fastify-trace.d.ts", "./tmp/register-trace.d.ts"],
          output: "lib",
          dir: true,
        },
      },
    },
  ]),
);
