import type { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import type { RollupJsonOptions } from "@rollup/plugin-json";
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import type { RollupTypescriptOptions } from "@rollup/plugin-typescript";
import type { InputOption, ModuleFormat, OutputOptions, OutputPlugin, RollupOptions } from "rollup";
import type { bundleStats } from "rollup-plugin-bundle-stats";
import type { CopyOptions } from "rollup-plugin-copy";
import type { dts } from "rollup-plugin-dts";
import type { PluginPeerDepsExternalOptions } from "rollup-plugin-peer-deps-external";
import type { PostCSSPluginConf } from "rollup-plugin-postcss";
import type { PluginVisualizerOptions } from "rollup-plugin-visualizer";

export type RollupTypescriptPlugin = {
  enabled: boolean;
  override?: RollupTypescriptOptions;
};

export type RollupExternalsPlugin = {
  enabled: boolean;
  override?: PluginPeerDepsExternalOptions;
};

export type RollupJsonPlugin = {
  enabled: boolean;
  override?: RollupJsonOptions;
};

export type RollupNodeResolvePlugin = {
  enabled: boolean;
  override?: RollupNodeResolveOptions;
};

export type RollupCommonJSPlugin = {
  enabled: boolean;
  override?: RollupCommonJSOptions;
};

export type RollupBundleStatsPlugin = {
  enabled: boolean;
  override?: Parameters<typeof bundleStats>[0];
};

export type RollupVisualizerPlugin = {
  enabled: boolean;
  override?: PluginVisualizerOptions;
};

export type RollupPostCSSPlugin = {
  enabled: boolean;
  override?: Readonly<PostCSSPluginConf>;
};

export type RollupCopyPlugin = {
  enabled: boolean;
  override?: CopyOptions;
};

export type RollupDtsPlugin = {
  enabled: boolean;
  input: InputOption;
  output: string;
  dir?: boolean;
  override?: Parameters<typeof dts>[0];
};

export type RollupPlugin = {
  typescript?: RollupTypescriptPlugin;
  externals?: RollupExternalsPlugin;
  json?: RollupJsonPlugin;
  nodeResolver?: RollupNodeResolvePlugin;
  commonJS?: RollupCommonJSPlugin;
  bundleStats?: RollupBundleStatsPlugin;
  visualizer?: RollupVisualizerPlugin;
  postCSS?: RollupPostCSSPlugin;
  dts?: RollupDtsPlugin;
  copy?: RollupCopyPlugin;
};

export type RollupConfigOutputOptions = {
  override?: Omit<OutputOptions, "plugins"> & { plugins?: OutputPlugin[] };
  format: ModuleFormat;
};

export type CreateRollupConfigOptions = {
  config?: Omit<RollupOptions, "input" | "output" | "plugins">;
  input: InputOption;
  outputs: RollupConfigOutputOptions[];
  plugins?: RollupPlugin;
};
