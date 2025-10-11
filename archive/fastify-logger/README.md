# @krainovsd/fastify-logger

The library of helpers for logger fastify with pino transport. 


## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/fastify-logger
```

Using yarn:
```
yarn add @krainovsd/fastify-logger
```

Using npm:
```
npm install @krainovsd/fastify-logger
```


## Usage

```js
import fastify from "fastify";
import { defineTransport, defineMiddlewares, Logger } from "@krainovsd/fastify-logger"

fastify({
    logger: {
      transport: defineTransport({
        ext: ".cjs",
        deniedProperties: ["pid", "reqId"],
        format: "logfmt",
      }),
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : "info",
    },
    disableRequestLogging: true,
  });

const logger = new Logger({ logger: fastify.log })
logger.error({
  error: someError,
  info: { key1: "string", key2: "string" },
  message: "prepared urls for auth",
});

defineMiddlewares(fastify, {
    onError(error, request, reply) {},
    onRequest(request, reply) {},
    onResponse(request, reply) {},
    onSend(request, reply, payload) {},
  });

```

