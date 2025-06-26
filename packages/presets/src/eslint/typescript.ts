import parser from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import tsPlugin from "typescript-eslint";

export const TS_LINTER_PLUGIN = {
  ts: [
    ...tsPlugin.configs.strictTypeChecked,
    ...tsPlugin.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ] as Linter.Config[],
  krainovTS: [
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
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-for-in-array": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",

        "@typescript-eslint/no-confusing-void-expression": [
          "error",
          { ignoreArrowShorthand: true, ignoreVoidOperator: true },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { fixStyle: "inline-type-imports" },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": [
          "error",
          {
            ignoreTernaryTests: false,
            ignoreBooleanCoercion: true,
            ignoreConditionalTests: true,
            ignorePrimitives: { string: false, number: false, bigint: false, boolean: true },
          },
        ],
        "@typescript-eslint/strict-boolean-expressions": [
          "error",
          {
            allowAny: true,
            allowNullableBoolean: true,
            allowNullableEnum: true,
            allowNullableNumber: false,
            allowNullableObject: true,
            allowNullableString: true,
            allowNumber: false,
            allowString: false,
          },
        ],
      },
    },
  ] as Linter.Config[],
};
