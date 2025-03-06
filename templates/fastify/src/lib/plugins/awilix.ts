import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { Logger } from "@krainovsd/fastify-logger";
import { asFunction } from "awilix";
import type { FastifyInstance } from "fastify";

export async function registerAwilix(fastify: FastifyInstance) {
  await fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  });

  diContainer.register({
    logger: asFunction(() => new Logger({ logger: fastify.log }))
      .singleton()
      .proxy(),
  });
}
