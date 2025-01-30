/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";

const DEV = process.env.NODE_ENV === "development";

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "./lib/esm",
        format: "es",
        sourcemap: true,
        preserveModules: DEV,
      },
    ],
    plugins: [
      externals({ includeDependencies: !DEV }) as Plugin,
      typescript(),
      DEV && nodeResolve(),
      DEV && commonjs(),
    ],
  },
  {
    input: "./tmp/index.d.ts",
    output: [{ file: "lib/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
