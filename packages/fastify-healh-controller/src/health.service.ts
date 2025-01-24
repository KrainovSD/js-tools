import type { FastifyReply } from "fastify";

export class HealthService {
  health(response: unknown, reply: FastifyReply) {
    return reply.code(200).send(response);
  }
}
