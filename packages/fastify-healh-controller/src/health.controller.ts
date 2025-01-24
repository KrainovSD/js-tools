import { Logger } from "@krainovsd/fastify-logger";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { DEFAULT_SETTINGS, SCHEMA } from "./health.constants";
import { HealthService } from "./health.service";
import type { RouteOptions } from "./health.types";

export const healthController = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions & { routes?: RouteOptions[] },
  done: (error?: Error) => void,
) => {
  const logger = new Logger({ logger: fastify.log });

  try {
    const service = new HealthService();

    (options.routes ?? DEFAULT_SETTINGS).forEach((route) => {
      fastify.get(
        route.path,
        {
          schema: SCHEMA,
        },
        async (_, reply) => {
          service.health(route.response, reply);
        },
      );
    });
  } catch (error) {
    logger.error({ error, message: "init healthController" });
  }

  done();
};
