# @krainovsd/fastify-trace

The library of helpers for register fastify opentelemetry. 

## Required

ENV: `OTLP_SERVICE_NAME` - the service name for tracing

ENV: `OTLP_EXPORTER_URL` - the url for export tracing


## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/fastify-trace
```

Using yarn:
```
yarn add @krainovsd/fastify-trace
```

Using npm:
```
npm install @krainovsd/fastify-trace
```


## Usage

```js
import "@krainovsd/fastify-trace/tracing"
import { registerFastifyTrace } from "@krainovsd/fastify-trace"

registerFastifyTrace(fastify)
```

