import type { RouteOptions } from "./health.types";

export const DEFAULT_ROUTES: RouteOptions[] = [
  {
    path: "/api/healthz",
    tags: ["Health"],
    description: "Check health",
    response: async (_, reply) => {
      return await reply.code(200).send({ message: "ok" });
    },
  },
  {
    path: "/api/ping",
    tags: ["Health"],
    description: "Check health",
    response: async (_, reply) => {
      return await reply.code(200).send({ message: "pong" });
    },
  },
];
