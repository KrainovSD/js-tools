# @krainovsd/eslint-presets

Пакет с переиспользуемыми пресетами линтера.

## Download

```
pnpm i @krainovsd/eslint-presets
```

## Usage

```
const eslint-presets = require('@krainovsd/eslint-presets');

module.exports = [
  ...eslint-presets.configs.common,
  ...eslint-presets.configs.testing,
  ...eslint-presets.configs.react,
  ...eslint-presets.configs.typescript,
];

```

или

```
import eslint-presets from "@krainovsd/eslint-presets"

export default [
  ...eslint-presets.configs.common,
  ...eslint-presets.configs.testing,
  ...eslint-presets.configs.react,
  ...eslint-presets.configs.typescript,
];

```
