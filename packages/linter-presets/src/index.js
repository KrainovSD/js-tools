import common from "./configs/common";
import react from "./configs/react";
import testing from "./configs/testing";
import typescript from "./configs/typescript";

import * as pkg from "../package.json";

/**
 * @typedef {Object} MetaInterface
 * @property {string} name
 * @property {string} version
 */

/**
 * @typedef {{ plugins: Object.<string, any>, rules: import('eslint').Linter.RulesRecord, languageOptions: { parserOptions: import('eslint').Linter.ParserOptions } }} FlatConfig
 */

/**
 * @typedef {Object} Config
 * @property {FlatConfig[]} common
 * @property {FlatConfig[]} react
 * @property {FlatConfig[]} testing
 * @property {FlatConfig[]} typescript
 *
 */

/**
 * @typedef {Object} PluginInterface
 * @property {MetaInterface} meta
 * @property {Config} configs
 */

/** @type {PluginInterface} */
const eslintPlugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {
    common,
    react,
    testing,
    typescript,
  },
};

export default eslintPlugin;
