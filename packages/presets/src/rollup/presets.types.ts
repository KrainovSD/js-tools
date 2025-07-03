import type { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import type { RollupJsonOptions } from "@rollup/plugin-json";
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import type { Options as TerserOptions } from "@rollup/plugin-terser";
import type { RollupTypescriptOptions } from "@rollup/plugin-typescript";
import type { InputOption, InputPluginOption, OutputOptions, RollupOptions } from "rollup";
import type { bundleStats } from "rollup-plugin-bundle-stats";
import type { CopyOptions } from "rollup-plugin-copy";
import type { dts } from "rollup-plugin-dts";
import type { PluginPeerDepsExternalOptions } from "rollup-plugin-peer-deps-external";
import type { PostCSSPluginConf } from "rollup-plugin-postcss";
import type { PluginVisualizerOptions } from "rollup-plugin-visualizer";

export type RollupPluginPresets = {
  typescript: RollupPlugin<RollupTypescriptOptions>;
  externals: RollupPlugin<PluginPeerDepsExternalOptions>;
  json: RollupPlugin<RollupJsonOptions>;
  nodeResolver: RollupPlugin<RollupNodeResolveOptions>;
  commonJS: RollupPlugin<RollupCommonJSOptions>;
  bundleStats: RollupPlugin<Parameters<typeof bundleStats>[0]>;
  visualizer: RollupPlugin<PluginVisualizerOptions>;
  postCSS: RollupPlugin<Readonly<PostCSSPluginConf>>;
  dts: RollupPlugin<Parameters<typeof dts>[0]>;
  copy: RollupPlugin<CopyOptions>;
  terser: RollupPlugin<TerserOptions>;
};
export type RollupConfigPresets = {
  types: (opts: TypesConfigOptions) => RollupOptions;
  library: (opts: SingletonConfigOptions) => RollupOptions;
};

export type RollupOutputPresets = {
  esmMultiple: OutputOptions;
  esmSingle: OutputOptions;
  cjs: OutputOptions;
};

export type RollupPlugin<T> = (opts?: T) => InputPluginOption;

export type TypesConfigOptions = {
  input: InputOption;
  output: string;
  dir?: boolean;
};
export type SingletonConfigOptions = {
  input: InputOption;
  stats?: boolean;
  withDeps?: boolean;
  singleton?: boolean;
  sourcemap?: boolean;
  node?: boolean;
  compress?: boolean;
  esm: boolean | OutputOptions;
  cjs: boolean | OutputOptions;
};
