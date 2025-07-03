import { presets } from "@krainovsd/presets/rollup";
import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: ["./src/register-fastify-trace.ts", "./src/register-trace.ts"],
    output: [
      {
        dir: "./lib/esm",
        format: "esm",
        generatedCode: "es2015",
        preserveModules: true,
        sourcemap: false,
      },
      {
        dir: "./lib/cjs",
        format: "cjs",
        generatedCode: "es2015",
        preserveModules: true,
        sourcemap: false,
        entryFileNames: (info) => {
          return `${info.name}.cjs`;
        },
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
  presets.configs.types({
    input: ["./tmp/register-fastify-trace.d.ts", "./tmp/register-trace.d.ts"],
    output: "./lib",
    dir: true,
  }),
]);
