import type { Linter } from "eslint";
import * as pkg from "../../package.json";
import { JS_LINTER_PLUGINS } from "./javascript";
import { PRETTIER_LINTER_PLUGINS } from "./prettier";
import { REACT_LINTER_PLUGINS } from "./react";
import { TESTING_LINTER_PLUGINS } from "./testing";
import { TS_LINTER_PLUGIN } from "./typescript";
import { VUE_LINTER_PLUGINS } from "./vue";

type MetaInterface = {
  name: string;
  version: string;
};

type PresetKeys = "javascript" | "react" | "typescript" | "vue";

type PluginKeys =
  | "js"
  | "krainovJS"
  | "ts"
  | "krainovTS"
  | "jest"
  | "prettier"
  | "react"
  | "reactHooks"
  | "reactTesting"
  | "reactA11y"
  | "vue"
  | "krainovVue";

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
    javascript: [
      ...JS_LINTER_PLUGINS.js,
      ...JS_LINTER_PLUGINS.krainovJS,
      ...PRETTIER_LINTER_PLUGINS.prettier,
    ],
    typescript: [
      ...JS_LINTER_PLUGINS.js,
      ...JS_LINTER_PLUGINS.krainovJS,
      ...TS_LINTER_PLUGIN.ts,
      ...TS_LINTER_PLUGIN.krainovTS,
      ...PRETTIER_LINTER_PLUGINS.prettier,
    ],
    react: [
      ...JS_LINTER_PLUGINS.js,
      ...JS_LINTER_PLUGINS.krainovJS,
      ...TS_LINTER_PLUGIN.ts,
      ...TS_LINTER_PLUGIN.krainovTS,
      ...REACT_LINTER_PLUGINS.react,
      ...REACT_LINTER_PLUGINS.reactHooks,
      ...REACT_LINTER_PLUGINS.reactA11y,
      ...PRETTIER_LINTER_PLUGINS.prettier,
    ],
    vue: [
      ...JS_LINTER_PLUGINS.js,
      ...JS_LINTER_PLUGINS.krainovJS,
      ...TS_LINTER_PLUGIN.ts,
      ...TS_LINTER_PLUGIN.krainovTS,
      ...VUE_LINTER_PLUGINS.vue,
      ...VUE_LINTER_PLUGINS.krainovVue,
      ...PRETTIER_LINTER_PLUGINS.prettier,
    ],
  },
  plugins: {
    ...JS_LINTER_PLUGINS,
    ...REACT_LINTER_PLUGINS,
    ...TESTING_LINTER_PLUGINS,
    ...TS_LINTER_PLUGIN,
    ...PRETTIER_LINTER_PLUGINS,
    ...VUE_LINTER_PLUGINS,
  },
};

export default eslintPlugin;
