# @krainovsd/fastify-multipart

The library of helpers for multipart. 


## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/fastify-multipart
```

Using yarn:
```
yarn add @krainovsd/fastify-multipart
```

Using npm:
```
npm install @krainovsd/fastify-multipart
```


## Usage

```js
import fastify from "fastify";
import { ajvFilePlugin } from "@krainovsd/fastify-multipart"

fastify({
  ajv: {
    plugins: [ajvFilePlugin],
  },
});



const body: JsonSchema = {
  type: "object",
  properties: {
    config: {
      isFile: true,
    },
  },
} as const;

```

