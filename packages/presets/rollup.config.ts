import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";

export default defineConfig([
  {
    input: "src/index.ts",
    plugins: [externals({ includeDependencies: true }) as Plugin, json(), typescript()],
    output: [
      {
        file: "./lib/esm/index.js",
        format: "es",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        file: "./lib/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
    ],
  },
  {
    input: ["./tmp/src/index.d.ts"],
    output: [{ file: "./lib/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
