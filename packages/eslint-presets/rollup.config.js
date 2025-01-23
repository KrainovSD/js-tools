import { defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";
import { dts } from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "src/index.js",
    plugins: [externals({ includeDependencies: true }), json()],
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
