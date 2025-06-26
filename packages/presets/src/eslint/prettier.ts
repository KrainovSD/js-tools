import type { Linter } from "eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

export const PRETTIER_LINTER_PLUGINS = {
  prettier: [
    prettierConfig,
    prettierPluginRecommended,
    { rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] } },
  ] as Linter.Config[],
};
