import preset from "./lib/prettier/cjs/index.cjs";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...preset.recommended,
};
export default config;
