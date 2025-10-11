import openTelemetryPlugin, {
  type OpenTelemetryPluginOptions,
} from "@autotelic/fastify-opentelemetry";
import type { FastifyInstance, FastifyRequest } from "fastify";

function formatSpanName(req: FastifyRequest) {
  const method = req.method;
  const path = req.routeOptions.url;

  return `${method} ${path}`;
}

export async function registerFastifyTrace(
  fastify: FastifyInstance,
  options: OpenTelemetryPluginOptions = {},
) {
  await fastify.register(openTelemetryPlugin, {
    wrapRoutes: true,
    formatSpanName,
    ...options,
  });
}
