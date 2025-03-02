import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import copy from "rollup-plugin-copy";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";

export default defineConfig([
  {
    input: "src/eslint/index.ts",
    plugins: [
      externals({ includeDependencies: true }) as Plugin,
      json(),
      typescript(),
      /** Typescript */
      copy({ targets: [{ src: "src/typescript/**/*", dest: "lib/typescript" }] }),
    ],
    output: [
      {
        file: "./lib/eslint/esm/index.js",
        format: "es",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        file: "./lib/eslint/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
    ],
  },
  {
    input: ["./tmp/src/eslint/index.d.ts"],
    output: [{ file: "./lib/eslint/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "src/prettier/index.ts",
    plugins: [externals({ includeDependencies: true }) as Plugin, json(), typescript()],
    output: [
      {
        file: "./lib/prettier/esm/index.js",
        format: "es",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        file: "./lib/prettier/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
    ],
  },
  {
    input: ["./tmp/src/prettier/index.d.ts"],
    output: [{ file: "./lib/prettier/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "src/rollup/index.ts",
    plugins: [externals({ includeDependencies: true }) as Plugin, typescript()],
    output: [
      {
        file: "./lib/rollup/esm/index.js",
        format: "es",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        file: "./lib/rollup/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
    ],
  },
  {
    input: ["./tmp/src/rollup/index.d.ts"],
    output: [{ file: "./lib/rollup/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
