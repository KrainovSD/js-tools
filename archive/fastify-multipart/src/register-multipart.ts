import fastifyMultipart, { type FastifyMultipartBaseOptions } from "@fastify/multipart";
import type { FastifyInstance } from "fastify";

export async function registerMultipart(
  fastify: FastifyInstance,
  options: FastifyMultipartBaseOptions = {},
) {
  const fileSize = options.limits?.fileSize ?? 1024 * 1024 * 30;
  const files = options.limits?.files ?? 50;

  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    ...options,
    limits: { ...(options.limits ?? {}), fileSize, files },
  });
}
