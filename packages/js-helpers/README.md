# @krainovsd/js-helpers

The library of helpers for JS in Browser and NodeJS environments. 

## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/js-helpers
```

Using yarn:
```
yarn add @krainovsd/js-helpers
```

Using npm:
```
npm install @krainovsd/js-helpers
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
