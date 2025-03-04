# @krainovsd/js-helpers

The library of helpers for JS in Browser and NodeJS environments. 

## Installing

Using pnpm:
```
pnpm install @krainovsd/js-helpers
```

## Monorepo

Using in frontend app with monorepo make sure that node-fetch will be excluded from bundle.
```js
export default defineConfig({
  base: "/",
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      external: ["node-fetch"],
    },
  },
});
```

## Usage

```js
import { limitStreamOfRequests } from "@krainovsd/js-helpers"

limitStreamOfRequests({
    countRequests: 100,
    maxCountInParallel: 5,
    promiseGetter: () => {
      return api.requestApi();
    },
    collectResult: false,
    refetchAfterError: true,
    maxTryCount: 3,
  });
```

for NodeJS

```js
const { createRequestClientInstance } = require("@krainovsd/js-helpers")

createRequestClientInstance().requestApi({ method: "DELETE", path: "/entity/:id" });
```
