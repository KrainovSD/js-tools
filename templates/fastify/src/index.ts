import "@krainovsd/fastify-trace/trace";
import cookie from "@fastify/cookie";
import { DEFAULT_ROUTES, healthController } from "@krainovsd/fastify-health-controller";
import { getCorrectLog } from "@krainovsd/fastify-logger";
import { registerFastifyTrace } from "@krainovsd/fastify-trace";
import { getByPath } from "@krainovsd/js-helpers";
import "dotenv/config";
import client from "prom-client";
import { HOST, LOG_FORMAT, PORT } from "@/constants";
import {
  initFastify,
  initGraceful,
  registerAwilix,
  registerCors,
  registerMetrics,
  registerMiddlewares,
  registerSwagger,
} from "./lib/plugins";

async function startServer() {
  try {
    /** plugins */
    const fastify = await initFastify();
    await registerSwagger(fastify);
    await registerFastifyTrace(fastify);
    registerMetrics();
    await registerCors(fastify);
    await registerAwilix(fastify);
    await fastify.register(cookie, {
      hook: "onRequest",
      parseOptions: {},
    });
    registerMiddlewares(fastify);

    const graceful = initGraceful(fastify);

    /** controllers */
    fastify.register(healthController, {
      routes: [
        ...DEFAULT_ROUTES,
        {
          path: "/metrics",
          tags: ["Metrics"],
          description: "Get Metrics",
          response: async (_, reply) => {
            return await reply
              .header("content-type", client.register.contentType)
              .code(200)
              .send(client.register.metrics());
          },
        },
      ],
    });

    /** start */
    await fastify.listen({ host: HOST, port: +PORT });
    fastify.swagger();
    graceful.setReady();
  } catch (error: unknown) {
    getCorrectLog(
      {
        level: "error",
        error: getByPath(error, "message"),
        message: "something wrong",
      },
      [],
      LOG_FORMAT,
    );

    process.exit(1);
  }
}

void startServer();
