import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OTLP_SERVICE_NAME) throw new Error("OTLP_SERVICE_NAME required in env");
if (!process.env.OTLP_EXPORTER_URL) throw new Error("OTLP_EXPORTER_URL required in env");

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTLP_SERVICE_NAME,
  }),
  spanProcessors: [
    new SimpleSpanProcessor(new OTLPTraceExporter({ url: process.env.OTLP_EXPORTER_URL })),
  ],
});

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new PgInstrumentation(),
  ],
});
