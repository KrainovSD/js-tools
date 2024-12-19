/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";

const extensions = [".ts", ".js"];

export default defineConfig({
  input: "./src/index.ts",
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
  plugins: [externals() as Plugin, typescript(), nodeResolve({ extensions }), json(), commonjs()],
});
