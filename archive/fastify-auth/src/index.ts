declare module "fastify" {
  interface FastifyRequest {
    username?: string;
    token?: string;
  }
}

export * from "./Auth";
