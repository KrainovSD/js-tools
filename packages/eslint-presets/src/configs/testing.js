import jestPlugin from "eslint-plugin-jest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  jestPlugin.configs["flat/recommended"],
  {
    settings: {
      jest: {
        version: 29,
      },
    },
  },
];
