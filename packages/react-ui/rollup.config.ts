/* eslint-disable import/no-extraneous-dependencies */
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";

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
  plugins: [externals({ includeDependencies: true }) as Plugin, typescript()],
});
