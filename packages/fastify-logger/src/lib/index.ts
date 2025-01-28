import { getByPath } from "@krainovsd/js-helpers";
import { trace } from "@opentelemetry/api";
import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 } from "uuid";
import type { TransportFormat } from "../logger-types";

export function getTraceId() {
  return trace?.getActiveSpan?.()?.spanContext?.()?.traceId ?? undefined;
}

export function getErrorInfo(err: unknown, stack: boolean = true) {
  const error = getByPath(err, "message") ?? undefined;
  const errorStatus = getByPath(err, "status") ?? undefined;
  const errorDescription = getByPath(err, "description") ?? undefined;
  // eslint-disable-next-line no-nested-ternary
  const errorStack = stack ? (err instanceof Error ? err.stack : undefined) : undefined;

  const traceID = getTraceId();

  return { error, errorStatus, errorDescription, errorStack, traceID };
}

export function getRequestInfo(req: FastifyRequest) {
  const host = req.ip;
  const url = req.url;
  const method = req.method;
  const traceID = req.traceId ?? getTraceId();
  const operationId = req.operationId ?? v4();

  return { host, url, method, traceID, operationId };
}

export function getResponseInfo(res: FastifyReply) {
  const status = res?.statusCode ? String(res.statusCode) : null;

  return { status };
}

function isHasSpace(str: unknown): str is string {
  return typeof str === "string" && str.includes(" ");
}

export function getCorrectLog(
  obj: Record<string, unknown>,
  deniedProperties?: string[],
  format: TransportFormat = "logfmt",
) {
  const correctObj = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) =>
        !(
          (deniedProperties && deniedProperties.includes(key.toLowerCase())) ||
          typeof value === "undefined"
        ),
    ),
  );

  switch (format) {
    case "logfmt": {
      let log = "";

      Object.entries(correctObj).forEach(([key, value]) => {
        if (isHasSpace(value)) {
          value = `"${value}"`;
        }

        log += `${key}=${value} `;
      });
      // eslint-disable-next-line no-console
      console.log(log.trim());
      break;
    }
    case "json": {
      // eslint-disable-next-line no-console
      console.log(correctObj);
      break;
    }
    default: {
      break;
    }
  }
}
