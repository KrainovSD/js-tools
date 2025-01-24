declare module "fastify" {
  interface FastifyRequest {
    operationId?: string;
    traceId?: string;
  }
}

export { Logger } from "./logger";
export * from "./logger-types";
export { transportGetter } from "./transport-getter";
export * from "./lib";
