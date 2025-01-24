import { getByPath } from "@krainovsd/js-helpers";
import { trace } from "@opentelemetry/api";
import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 } from "uuid";

export function getTraceId() {
  return trace?.getActiveSpan?.()?.spanContext?.()?.traceId ?? undefined;
}

export function getErrorInfo(err: unknown) {
  const error = getByPath(err, "message") ?? undefined;
  const errorStatus = getByPath(err, "status") ?? undefined;
  const errorDescription = getByPath(err, "description") ?? undefined;
  const errorStack = err instanceof Error ? err.stack : undefined;

  const traceId = getTraceId();

  return { error, errorStatus, errorDescription, errorStack, traceId };
}

export function getRequestInfo(req: FastifyRequest) {
  const host = req.ip;
  const url = req.url;
  const method = req.method;
  const traceId = req.traceId ?? getTraceId();
  const operationId = req.operationId ?? v4();

  return { host, url, method, traceId, operationId };
}

export function getResponseInfo(res: FastifyReply) {
  const status = res?.statusCode ? String(res.statusCode) : null;

  return { status };
}

function isHasSpace(str: unknown): str is string {
  return typeof str === "string" && str.includes(" ");
}

export function getCorrectLog(obj: Record<string, unknown>, deniedProperties?: string[]) {
  let log = "";
  for (let [key, value] of Object.entries(obj)) {
    if (
      (deniedProperties && deniedProperties.includes(key.toLowerCase())) ||
      typeof value === "undefined"
    )
      continue;

    if (isHasSpace(value)) {
      value = `"${value}"`;
    }

    log += `${key}=${value} `;
  }

  // eslint-disable-next-line no-console
  console.log(log.trim());
}
