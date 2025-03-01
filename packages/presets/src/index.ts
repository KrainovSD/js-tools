import type { Linter } from "eslint";
import * as pkg from "../package.json";
import common from "./eslint/common";
import react from "./eslint/react";
import testing from "./eslint/testing";
import typescript from "./eslint/typescript";

type MetaInterface = {
  name: string;
  version: string;
};

type Config = {
  common: Linter.Config[];
  react: Linter.Config[];
  testing: Linter.Config[];
  typescript: Linter.Config[];
};

type PluginInterface = {
  meta: MetaInterface;
  configs: Config;
};

const eslintPlugin: PluginInterface = {
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
