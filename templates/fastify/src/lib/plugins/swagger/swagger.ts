import fastifySwagger from "@fastify/swagger";
import type { FastifyInstance } from "fastify";
import { SERVICE_NAME } from "@/constants";

export async function swagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: SERVICE_NAME,
        version: process.env.APP_VERSION || "dev",
      },
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [],
      //   securityDefinitions: {
      //     Token: {
      //       description: 'Authorization header token, sample: "Bearer #TOKEN#"',
      //       type: "apiKey",
      //       name: "Authorization",
      //       in: "header",
      //     },
      //     KeycloakAuth: {
      //       type: "oauth2",
      //       flow: "password",
      //       tokenUrl: process.env.OAUTH_TOKEN_URL!,
      //       scopes: {},
      //     },
      //   },
    },
  });
}
