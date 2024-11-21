/* eslint-disable import/no-extraneous-dependencies */
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
// eslint-disable-next-line prettier/prettier
import pkg from "./package.json" with { type: "json" };


export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      file: pkg.exports["."].import,
      format: "es",
    },
    {
      file: pkg.exports["."].require,
      format: "cjs",
    },
  ],
  plugins: [
    externals({ includeDependencies: true }) as Plugin,
    terser(),
    typescript(),
  ],
});
