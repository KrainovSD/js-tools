import { defineTransport } from "@krainovsd/fastify-logger";
import fastify from "fastify";
import { LOG_FORMAT, LOG_LEVEL } from "@/constants";

export function initFastify() {
  return fastify({
    logger: {
      transport: defineTransport({
        ext: ".cjs",
        deniedProperties: ["pid", "reqId"],
        format: LOG_FORMAT,
      }),
      level: LOG_LEVEL,
    },
    disableRequestLogging: true,
  });
}
