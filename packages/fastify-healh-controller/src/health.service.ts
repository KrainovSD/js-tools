import type { FastifyReply } from "fastify";

export class HealthService {
  async health(response: unknown, reply: FastifyReply) {
    return await reply.code(200).send(response);
  }
}
