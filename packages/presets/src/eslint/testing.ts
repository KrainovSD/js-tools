import type { Linter } from "eslint";
import jestPlugin from "eslint-plugin-jest";

export const TESTING_LINTER_PLUGINS = {
  jest: [
    jestPlugin.configs["flat/recommended"],
    {
      settings: {
        jest: {
          version: 29,
        },
      },
    },
  ] as Linter.Config[],
};
