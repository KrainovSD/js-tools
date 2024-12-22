/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "./lib/esm",
      format: "es",
      generatedCode: "es2015",
      sourcemap: true,
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
    externals() as Plugin,
    typescript(),
    nodeResolve(),
    commonjs(),
    postcss({
      modules: {
        generateScopedName: "_[local]_[hash:base64:5]",
      },
      minimize: true,
      use: {
        // TODO: Waiting issue
        sass: {
          silenceDeprecations: ["legacy-js-api"],
        },
        less: undefined,
        stylus: undefined,
      },
    }) as Plugin,
  ],
});
