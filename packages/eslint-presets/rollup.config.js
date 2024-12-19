import { defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";

export default defineConfig({
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
});
