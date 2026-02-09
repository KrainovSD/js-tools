import presets from "./lib/prettier/esm/index.js";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...presets.recommended,
};
export default config;
