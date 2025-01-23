/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, type RollupOptions, defineConfig } from "rollup";
import { bundleStats } from "rollup-plugin-bundle-stats";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";
import { visualizer } from "rollup-plugin-visualizer";

const DEV = process.env.NODE_ENV === "development";

const config: RollupOptions[] = [
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "./lib/esm",
        format: "es",
        generatedCode: "es2015",
        sourcemap: true,
        plugins: [
          DEV &&
            bundleStats({
              json: true,
              html: true,
              baseline: true,
              baselineFilepath: "./baseline.json",
              outDir: "../../stats",
              compare: true,
            }),
          DEV &&
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
        file: "./lib/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
    ],
    plugins: [
      externals({ includeDependencies: !DEV }) as Plugin,
      typescript(),
      json(),
      DEV && nodeResolve({ extensions: [".ts", ".js"] }),
      DEV && commonjs(),
    ],
  },
];

if (!DEV) {
  config.push({
    input: ["./tmp/index.d.ts"],
    output: [{ file: "./lib/index.d.ts", format: "es" }],
    plugins: [dts()],
  });
}

export default defineConfig(config);
