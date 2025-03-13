import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import {
  type InputPluginOption,
  type OutputOptions,
  type OutputPlugin,
  type Plugin,
  type RollupOptions,
} from "rollup";
import { bundleStats } from "rollup-plugin-bundle-stats";
import copy from "rollup-plugin-copy";
import { dts } from "rollup-plugin-dts";
import externals from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { visualizer } from "rollup-plugin-visualizer";
import type {
  CreateRollupConfigOptions,
  RollupDtsPlugin,
  RollupPlugin,
} from "./create-config.types";

const OUTPUT_PRESETS: OutputOptions[] = [
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
];

export function createRollupConfig(configOptions: CreateRollupConfigOptions[]): RollupOptions[] {
  const configs: RollupOptions[] = [];

  for (const options of configOptions) {
    const output = getRollupOutput(options);
    const plugins = getRollupPlugins(options.plugins);
    configs.push({
      ...options.config,
      input: options.input,
      output,
      plugins,
    });

    if (options.plugins?.dts) {
      configs.push(getTypesConfig(options.plugins.dts));
    }
  }

  return configs;
}

function getRollupOutput(options: CreateRollupConfigOptions): OutputOptions[] {
  const output: OutputOptions[] = [];

  for (const option of options.outputs) {
    const preset = OUTPUT_PRESETS.find((pr) => pr.format === option.format);
    if (preset == undefined && option.override == undefined)
      throw new Error(`Empty preset and override for format ${option.format}`);

    const plugins: OutputPlugin[] = option.override?.plugins ?? [];

    /** Bundle stats */
    if (option.format === "es" && options.plugins?.bundleStats?.enabled) {
      plugins.push(
        bundleStats(
          options.plugins.bundleStats.override ?? {
            json: true,
            html: true,
            baseline: true,
            baselineFilepath: "./baseline.json",
            outDir: "../../stats",
            compare: true,
          },
        ),
      );
    }
    /** Visualizer */
    if (option.format === "es" && options.plugins?.visualizer?.enabled) {
      plugins.push(
        visualizer(
          options?.plugins?.visualizer?.override ?? {
            gzipSize: true,
            filename: "./stats/stats.html",
            template: "flamegraph",
          },
        ),
      );
    }

    output.push({ ...(option.override ?? preset), plugins });
  }

  return output;
}

function getRollupPlugins(options: RollupPlugin = {}): InputPluginOption {
  const plugins: InputPluginOption = [];

  if (options.externals?.enabled) {
    plugins.push(externals({ ...options.externals.override }) as Plugin);
  }

  if (options.typescript?.enabled) {
    plugins.push(typescript({ ...options.typescript.override }));
  }

  if (options.json?.enabled) {
    plugins.push(json({ ...options.json.override }));
  }

  if (options.nodeResolver?.enabled) {
    plugins.push(nodeResolve({ ...options.nodeResolver.override }));
  }

  if (options.commonJS?.enabled) {
    plugins.push(commonjs({ ...options.commonJS.override }));
  }

  if (options.postCSS?.enabled) {
    plugins.push(
      postcss(
        options.postCSS.override ?? {
          modules: {
            generateScopedName: "_[local]_[hash:base64:5]",
          },
          minimize: true,
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
    );
  }

  if (options.copy?.enabled) {
    plugins.push(copy({ ...options.copy.override }));
  }

  if (options.terser?.enabled) {
    plugins.push(terser({ ...options.terser.override }));
  }

  if (options.start) plugins.unshift(...options.start);
  if (options.end) plugins.push(...options.end);

  return plugins;
}

function getTypesConfig(options: RollupDtsPlugin): RollupOptions {
  return {
    input: options.input,
    output: [
      {
        file: options.dir ? undefined : options.output,
        dir: options.dir ? options.output : undefined,
        format: "es",
      },
    ],
    plugins: [dts({ ...options.override })],
  };
}
