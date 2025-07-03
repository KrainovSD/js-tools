import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { type InputPluginOption } from "rollup";
import { bundleStats } from "rollup-plugin-bundle-stats";
import copy from "rollup-plugin-copy";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { visualizer } from "rollup-plugin-visualizer";
import type {
  RollupConfigPresets,
  RollupOutputPresets,
  RollupPluginPresets,
} from "./presets.types";

const PLUGINS: RollupPluginPresets = {
  bundleStats: (opts) =>
    bundleStats(
      opts ?? {
        json: true,
        html: true,
        baseline: true,
        baselineFilepath: "./baseline.json",
        outDir: "../../stats",
        compare: true,
      },
    ),
  visualizer: (opts) =>
    visualizer(
      opts ?? {
        gzipSize: true,
        filename: "./stats/stats.html",
        template: "flamegraph",
      },
    ),
  postCSS: (opts) =>
    postcss(
      opts ?? {
        minimize: true,
        modules: {
          generateScopedName: "[local]_[hash:base64:5]",
        },
        use: {
          // Waiting issue
          sass: {
            silenceDeprecations: ["legacy-js-api"],
          },
          less: undefined,
          stylus: undefined,
        },
      },
    ),
  copy: (opts) => copy(opts),
  dts: (opts) => dts(opts),
  commonJS: (opts) => commonjs(opts),
  nodeResolver: (opts) => nodeResolve(opts),
  externals: (opts) => externals(opts) as InputPluginOption,
  json: (opts) => json(opts),
  terser: (opts) => terser(opts ?? { mangle: true, compress: true }),
  typescript: (opts) => typescript(opts),
};

const OUTPUTS: RollupOutputPresets = {
  cjs: {
    file: "./lib/cjs/index.cjs",
    format: "cjs",
    generatedCode: "es2015",
    sourcemap: true,
  },
  esmMultiple: {
    dir: "./lib/esm",
    format: "es",
    generatedCode: "es2015",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  esmSingle: {
    file: "./lib/esm/index.js",
    format: "es",
    generatedCode: "es2015",
    sourcemap: true,
  },
};

const CONFIGS: RollupConfigPresets = {
  types: (opts) => ({
    input: opts.input,
    output: [
      {
        file: opts.dir ? undefined : opts.output,
        dir: opts.dir ? opts.output : undefined,
        format: "es",
      },
    ],
    plugins: [dts()],
  }),
  library: (opts) => {
    const {
      input,
      cjs,
      esm,
      node = true,
      compress = false,
      withDeps = false,
      singleton = false,
      sourcemap = true,
      stats = false,
    } = opts;

    return {
      input,
      output: [
        ...(cjs ? [{ ...OUTPUTS.cjs, sourcemap, ...(typeof cjs === "object" ? cjs : {}) }] : []),
        ...(esm
          ? [
              ...(singleton
                ? [{ ...OUTPUTS.esmSingle, sourcemap, ...(typeof esm === "object" ? esm : {}) }]
                : [{ ...OUTPUTS.esmMultiple, sourcemap, ...(typeof esm === "object" ? esm : {}) }]),
            ]
          : []),
      ],
      plugins: [
        PLUGINS.externals({ includeDependencies: !withDeps }),
        PLUGINS.typescript(),
        PLUGINS.json(),
        PLUGINS.postCSS(),
        ...(node ? [PLUGINS.nodeResolver(), PLUGINS.commonJS()] : []),
        ...(stats ? [PLUGINS.bundleStats(), PLUGINS.visualizer] : []),
        ...(compress ? [PLUGINS.terser()] : []),
      ],
    };
  },
};

export const presets = {
  configs: CONFIGS,
  outputs: OUTPUTS,
  plugins: PLUGINS,
};
