/* eslint-disable */
import tsPlugin from "typescript-eslint";
import parser from "@typescript-eslint/parser";

export default [
  /** eslint ts recommended */
  ...tsPlugin.configs.recommendedTypeChecked,
  ...tsPlugin.configs.strictTypeChecked,
  ...tsPlugin.configs.strictTypeChecked,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-meaningless-void-operator": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/unbound-method": "off",

      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true, ignoreVoidOperator: true },
      ],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    },
  },
];
