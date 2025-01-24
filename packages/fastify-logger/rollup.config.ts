/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, type RollupOptions, defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";

const DEV = process.env.NODE_ENV === "development";

const config: RollupOptions[] = [
  {
    input: ["./src/index.ts"],
    output: [
      {
        file: "./lib/cjs/index.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        dir: "./lib/esm",
        format: "esm",
        generatedCode: "es2015",
        preserveModules: true,
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
  {
    input: ["./src/transport.ts"],
    output: [
      {
        file: "./lib/cjs/transport.cjs",
        format: "cjs",
        generatedCode: "es2015",
        sourcemap: true,
      },
      {
        file: "./lib/esm/transport.js",
        format: "esm",
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
    output: [{ file: "lib/index.d.ts", format: "cjs" }],
    plugins: [dts()],
  });
}

export default defineConfig(config);
