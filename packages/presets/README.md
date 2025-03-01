# @krainovsd/eslint-presets

The library of flat eslint-presets.

## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/eslint-presets
```

Using yarn:
```
yarn add @krainovsd/eslint-presets
```

Using npm:
```
npm install @krainovsd/eslint-presets
```

## Usage

```js
const eslintPresets = require('@krainovsd/eslint-presets');

module.exports = [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```

или

```js
import eslintPresets from "@krainovsd/eslint-presets"

export default [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```
