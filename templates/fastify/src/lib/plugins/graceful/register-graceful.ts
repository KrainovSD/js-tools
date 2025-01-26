import GracefulServer from "@gquittet/graceful-server";
import { getCorrectLog, getErrorInfo } from "@krainovsd/fastify-logger";
import type { FastifyInstance } from "fastify";
import { LOG_FORMAT } from "@/constants";

export function initGraceful(fastify: FastifyInstance) {
  const gracefulServer = GracefulServer(fastify.server);

  gracefulServer.on(GracefulServer.READY, () => {
    getCorrectLog(
      {
        level: "info",
        time: new Date().toISOString(),
        message: "Server is ready",
      },
      [],
      LOG_FORMAT,
    );
  });
  gracefulServer.on(GracefulServer.SHUTTING_DOWN, (error) => {
    const info = getErrorInfo(error);
    getCorrectLog(
      {
        level: "warn",
        time: new Date().toISOString(),
        ...info,
        message: "Server is shutting down",
      },
      [],
      LOG_FORMAT,
    );
  });
  gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
    const info = getErrorInfo(error);
    getCorrectLog(
      {
        level: "error",
        time: new Date().toISOString(),
        ...info,
        message: "Server is down",
      },
      [],
      LOG_FORMAT,
    );
  });

  return gracefulServer;
}
