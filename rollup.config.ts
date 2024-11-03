/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import eslint from "@rollup/plugin-eslint";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import * as pkg from "./package.json";

const extensions = [".ts", ".js"];

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      file: pkg.exports["."].import,
      format: "es",
      generatedCode: "es2015",
    },
    {
      file: pkg.exports["."].require,
      format: "cjs",
      generatedCode: "es2015",
    },
  ],
  plugins: [
    externals({ includeDependencies: true }) as Plugin,
    terser() as Plugin,
    eslint({
      throwOnError: true,
      throwOnWarning: true,
    }),
    typescript(),
    nodeResolve({ extensions }),
    json(),
    commonjs(),
  ],
});
