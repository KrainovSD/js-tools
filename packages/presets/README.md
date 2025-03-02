# @krainovsd/presets

The library of flat presets.

## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/presets
```

Using yarn:
```
yarn add @krainovsd/presets
```

Using npm:
```
npm install @krainovsd/presets
```

## Usage

```js
const eslintPresets = require('@krainovsd/presets');

module.exports = [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```

или

```js
import eslintPresets from "@krainovsd/presets"

export default [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```
