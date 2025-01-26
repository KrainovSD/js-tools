import type { FastifyInstance } from "fastify";
import { swagger } from "./swagger";
import { swaggerUi } from "./swagger-ui";

export async function registerSwagger(fastify: FastifyInstance) {
  await swagger(fastify);
  await swaggerUi(fastify);
}
