/* eslint-disable import/no-extraneous-dependencies */
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type Plugin, type RollupOptions, defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

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
      }),
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
