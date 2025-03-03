import jsPlugin from "@eslint/js";
import type { Linter } from "eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

export const JS_LINTER_PLUGINS = {
  js: [jsPlugin.configs.all] as Linter.Config[],
  prettier: [
    prettierConfig,
    prettierPluginRecommended,
    { rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] } },
  ] as Linter.Config[],
  krainovJS: [
    {
      ignores: ["dist/**", "node_modules/**", "bin/**", "build/**", "lib/**", "tmp/**"],
      rules: {
        "func-style": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        "no-use-before-define": "off",
        "no-restricted-syntax": "off",
        "no-shadow": "off",
        "no-void": "off",
        "no-continue": "off",
        "class-methods-use-this": "off",
        "no-param-reassign": "off",
        eqeqeq: "off",
        "prefer-destructuring": "off",
        "consistent-return": "off",
        "no-undef": "off",
        "linebreak-style": "off",
        "no-plusplus": "off",
        "no-empty-function": "off",
        "no-empty": "off",
        "sort-imports": "off",
        "sort-keys": "off",
        "capitalized-comments": "off",
        "one-var": "off",
        "no-magic-numbers": "off",
        "require-unicode-regexp": "off",
        "no-ternary": "off",
        "init-declarations": "off",
        "no-undefined": "off",
        "max-lines-per-function": "off",
        "max-statements": "off",
        "prefer-named-capture-group": "off",
        complexity: "off",
        "require-atomic-updates": "off",
        "max-lines": "off",
        "arrow-body-style": "off",
        "no-inline-comments": "off",
        "no-negated-condition": "off",
        "no-invalid-this": "off",
        "no-nested-ternary": "off",
        "no-duplicate-imports": "off",

        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-await-in-loop": "error",
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", prev: "*", next: "return" },
        ],
        "prefer-const": ["error", { destructuring: "all" }],
        "no-bitwise": ["error", { allow: ["~"] }],
        "no-implicit-coercion": [
          "error",
          {
            disallowTemplateShorthand: true,
            allow: ["!!", "~", "+"],
            boolean: true,
            string: true,
            number: true,
          },
        ],
        "id-length": ["error", { exceptions: ["x", "y", "z", "i", "j", "_", "t"] }],
      },
    },
  ] as Linter.Config[],
};

export default [
  ...JS_LINTER_PLUGINS.js,
  ...JS_LINTER_PLUGINS.prettier,
  ...JS_LINTER_PLUGINS.krainovJS,
] as Linter.Config[];
