import { recommended } from "@krainovsd/presets/prettier";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...recommended,
  vueIndentScriptAndStyle: true,
};
export default config;
