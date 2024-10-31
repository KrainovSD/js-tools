import { defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";

export default defineConfig({
  input: "src/index.js",
  plugins: [externals({ includeDependencies: true }), json()],
  output: [
    {
      format: "esm",
      file: "./lib/esm/bundle.js",
    },
    {
      format: "commonjs",
      file: "./lib/cjs/bundle.cjs",
    },
  ],
});
