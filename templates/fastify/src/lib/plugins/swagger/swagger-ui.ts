import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export async function swaggerUi(fastify: FastifyInstance) {
  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    // initOAuth: {
    //   clientId: OAUTH_CLIENT_ID,
    //   clientSecret: OAUTH_CLIENT_SECRET,
    // },
  });
}
