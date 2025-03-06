import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { SERVICE_NAME } from "@/constants";

export async function registerSwagger(fastify: FastifyInstance) {
  await swagger(fastify);
  await swaggerUi(fastify);
}

async function swaggerUi(fastify: FastifyInstance) {
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

async function swagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: SERVICE_NAME,
        version: process.env.APP_VERSION ?? "dev",
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
