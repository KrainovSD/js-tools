/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Cradle, RequestCradle } from "@fastify/awilix";
import type { Logger } from "@krainovsd/fastify-logger";
import type { FastifyRequest } from "fastify";

declare module "@fastify/awilix" {
  interface Cradle {
    logger: Logger;
  }
  interface RequestCradle {
    logger: Logger;
  }
}
