import { Logger } from "@krainovsd/fastify-logger";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { DEFAULT_ROUTES } from "./health.constants";
import type { RouteOptions, Schema } from "./health.types";

export const healthController = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions & { routes?: RouteOptions[] },
  done: (error?: Error) => void,
) => {
  const logger = new Logger({ logger: fastify.log });

  try {
    (options.routes ?? DEFAULT_ROUTES).forEach((route) => {
      fastify.get(
        route.path,
        {
          schema: {
            description: route.description,
            tags: route.tags,
          } as Schema,
        },
        async (res, reply) => {
          await route.response(res, reply);
        },
      );
    });
  } catch (error) {
    logger.error({ error, message: "init healthController" });
  }

  done();
};
