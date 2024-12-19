# @krainovsd/eslint-presets

Пакет с переиспользуемыми пресетами линтера.

## Download

```
pnpm i @krainovsd/eslint-presets
```

## Usage

```
const eslintPresets = require('@krainovsd/eslint-presets');

module.exports = [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```

или

```
import eslintPresets from "@krainovsd/eslint-presets"

export default [
  ...eslintPresets.configs.common,
  ...eslintPresets.configs.testing,
  ...eslintPresets.configs.react,
  ...eslintPresets.configs.typescript,
];

```
