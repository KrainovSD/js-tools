/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Cradle, RequestCradle } from "@fastify/awilix";
import type { FastifyRequest } from "fastify";
import type { Logger } from "./lib/modules/logger";

declare module "@fastify/awilix" {
  interface Cradle {
    logger: Logger;
  }
  interface RequestCradle {
    logger: Logger;
  }
}
