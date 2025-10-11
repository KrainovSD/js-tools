declare module "fastify" {
  interface FastifyRequest {
    operationId?: string;
    traceId?: string;
  }
}

export { Logger } from "./logger";
export * from "./logger-types";
export { defineTransport } from "./define-transport";
export { defineMiddlewares } from "./define-middlewares";
export * from "./lib";
