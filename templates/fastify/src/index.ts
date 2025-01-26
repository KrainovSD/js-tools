import "@krainovsd/fastify-trace/trace";
import cookie from "@fastify/cookie";
import { healthController } from "@krainovsd/fastify-health-controller";
import { getCorrectLog } from "@krainovsd/fastify-logger";
import { registerFastifyTrace } from "@krainovsd/fastify-trace";
import { getByPath } from "@krainovsd/js-helpers";
import "dotenv/config";
import { HOST, LOG_FORMAT, PORT } from "@/constants";
import {
  initFastify,
  initGraceful,
  registerAwilix,
  registerCors,
  registerMiddlewares,
  registerSwagger,
} from "./lib/plugins";

async function startServer() {
  try {
    /** plugins */
    const fastify = await initFastify();
    await registerSwagger(fastify);
    await registerFastifyTrace(fastify);
    await registerCors(fastify);
    await registerAwilix(fastify);
    await fastify.register(cookie, {
      hook: "onRequest",
      parseOptions: {},
    });
    registerMiddlewares(fastify);

    const graceful = initGraceful(fastify);

    /** controllers */
    await fastify.register(healthController);

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
