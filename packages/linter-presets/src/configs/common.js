/* eslint-disable */
import { FlatCompat } from "@eslint/eslintrc";
import jsPlugin from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  /** eslint js recommended */
  jsPlugin.configs.recommended,
  /** airbnb-base */
  ...compat.extends("eslint-config-airbnb-base"),
  /** prettier */
  prettierConfig,
  prettierPluginRecommended,
  {
    ignores: ["dist/**", "node_modules/**", "bin/**", "build/**", "lib/**", "tmp/**"],
    rules: {
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",

      "prettier/prettier": ["error", { endOfLine: "auto" }],

      "no-use-before-define": "off",
      "no-restricted-syntax": "off",
      "no-shadow": "off",
      "no-void": "off",
      "no-bitwise": ["error", { allow: ["~"] }],
      "no-continue": "off",
      "class-methods-use-this": "off",
      "no-param-reassign": "off",
      eqeqeq: "off",
      "prefer-destructuring": "off",
      "consistent-return": "off",
      "no-undef": "off",
      "linebreak-style": "off",
      "no-plusplus": "off",

      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },
];
