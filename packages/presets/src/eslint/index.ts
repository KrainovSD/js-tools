import type { Linter } from "eslint";
import * as pkg from "../../package.json";
import javascript, { JS_LINTER_PLUGINS } from "./javascript";
import react, { REACT_LINTER_PLUGINS } from "./react";
import testing, { TESTING_LINTER_PLUGINS } from "./testing";
import typescript, { TS_LINTER_PLUGIN } from "./typescript";

type MetaInterface = {
  name: string;
  version: string;
};

type PresetKeys = "javascript" | "react" | "testing" | "typescript";

type PluginKeys =
  | "js"
  | "prettier"
  | "krainovJS"
  | "react"
  | "reactHooks"
  | "a11y"
  | "testingReact"
  | "jest"
  | "ts"
  | "krainovTS";

type Preset = Record<PresetKeys, Linter.Config[]>;
type Plugin = Record<PluginKeys, Linter.Config[]>;

type PluginInterface = {
  meta: MetaInterface;
  presets: Preset;
  plugins: Plugin;
};

const eslintPlugin: PluginInterface = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  presets: {
    javascript,
    react,
    testing,
    typescript,
  },
  plugins: {
    ...JS_LINTER_PLUGINS,
    ...REACT_LINTER_PLUGINS,
    ...TESTING_LINTER_PLUGINS,
    ...TS_LINTER_PLUGIN,
  },
};

export default eslintPlugin;
