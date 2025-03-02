import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
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

  for (const { format, override = {} } of options.outputs) {
    const preset = OUTPUT_PRESETS.find((pr) => pr.format === format) ?? {};
    if (Object.keys(preset).length === 0 && Object.keys(override).length === 0)
      throw new Error(`Empty preset and override for format ${format}`);

    const plugins: OutputPlugin[] = override.plugins ?? [];

    /** Bundle stats */
    if (format === "es" && options.plugins?.bundleStats?.enabled) {
      plugins.push(
        bundleStats({
          json: true,
          html: true,
          baseline: true,
          baselineFilepath: "./baseline.json",
          outDir: "../../stats",
          compare: true,
          ...options.plugins?.bundleStats?.override,
        }),
      );
    }
    /** Visualizer */
    if (format === "es" && options.plugins?.visualizer?.enabled) {
      plugins.push(
        visualizer({
          gzipSize: true,
          filename: "./stats/stats.html",
          template: "flamegraph",
          ...options.plugins?.visualizer?.override,
        }),
      );
    }

    output.push({ ...preset, ...override, plugins });
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

  if (options.postCSS) {
    plugins.push(
      postcss({
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
        ...options.postCSS.override,
      }),
    );
  }

  if (options.copy) {
    plugins.push(copy({ ...options.copy.override }));
  }

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
