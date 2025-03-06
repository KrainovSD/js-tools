import type { FastifyReply } from "fastify";

export class HealthService {
  async health(response: unknown, reply: FastifyReply) {
    let currentResponse = response;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (typeof currentResponse === "function") currentResponse = currentResponse();

    return await reply.code(200).send(currentResponse);
  }
}
