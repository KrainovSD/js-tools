/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import { bundleStats } from "rollup-plugin-bundle-stats";
import externals from "rollup-plugin-peer-deps-external";
import { visualizer } from "rollup-plugin-visualizer";

const extensions = [".ts", ".js"];

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "./lib/esm",
      format: "es",
      generatedCode: "es2015",
      sourcemap: true,
      plugins: [
        bundleStats({
          json: true,
          html: true,
          baseline: true,
          baselineFilepath: "./baseline.json",
          outDir: "../../stats",
          compare: true,
        }),
        visualizer({
          gzipSize: true,
          filename: "./stats/stats.html",
          template: "flamegraph",
        }),
      ],
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    {
      dir: "./lib/cjs",
      format: "cjs",
      generatedCode: "es2015",
      sourcemap: true,
    },
  ],
  plugins: [externals() as Plugin, typescript(), nodeResolve({ extensions }), json(), commonjs()],
});
