/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";

const extensions = [".ts", ".js"];

const DEV = process.env.NODE_ENV === "development";

export default defineConfig([
  {
    input: ["./src/register-fastify-trace.ts", "./src/register-trace.ts"],
    output: [
      {
        dir: "./lib/cjs",
        format: "cjs",
        generatedCode: "es2015",
        preserveModules: true,
        sourcemap: true,
        entryFileNames: (info) => {
          return `${info.name}.cjs`;
        },
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
      DEV && nodeResolve({ extensions }),
      DEV && commonjs(),
    ],
  },
  {
    input: ["./tmp/register-fastify-trace.d.ts", "./tmp/register-trace.d.ts"],
    output: [{ dir: "lib", format: "cjs" }],
    plugins: [dts()],
  },
]);
