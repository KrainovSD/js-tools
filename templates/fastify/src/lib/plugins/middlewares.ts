import { defineMiddlewares } from "@krainovsd/fastify-logger";
import type { FastifyInstance } from "fastify";

export function registerMiddlewares(fastify: FastifyInstance) {
  fastify.addHook("onListen", function onListen(done) {
    done();
  });

  defineMiddlewares(fastify);
}
