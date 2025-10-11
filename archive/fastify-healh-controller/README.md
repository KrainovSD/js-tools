# @krainovsd/fastify-health-controller

The library of helpers for health-controller. 


## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/fastify-health-controller
```

Using yarn:
```
yarn add @krainovsd/fastify-health-controller
```

Using npm:
```
npm install @krainovsd/fastify-health-controller
```


## Usage

```js
import fastify from "fastify";
import { healthController } from "@krainovsd/fastify-health-controller"

await fastify.register(healthController, { routes: [
  { path: "/api/healthz", response: { message: "ok" } },
  { path: "/api/ping", response: { message: "pong" } },
]});

```

