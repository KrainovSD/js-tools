import type { FastifyInstance } from "fastify";
import { getRequestInfo, getResponseInfo } from "./lib";
import { Logger } from "./logger";
import type { DefineMiddlewareSettings } from "./logger-types";

export function defineMiddlewares(
  fastify: FastifyInstance,
  settings: DefineMiddlewareSettings = {},
) {
  const logger = new Logger({ logger: fastify.log });

  fastify.setErrorHandler(function onError(error, request, reply) {
    const status = error.statusCode ?? 500;
    if (
      status === 500 &&
      (settings.errorLogFilter == undefined || settings.errorLogFilter(request))
    ) {
      const requestInfo = getRequestInfo(request);
      logger.error({ error, info: requestInfo, message: "error" });
    }

    settings.onError?.(error, request, reply);

    reply
      .status(status)
      .header("traceId", request.traceId)
      .header("operationId", request.operationId)
      .send({
        traceId: request.traceId,
        operationId: request.operationId,
        message: error.message,
      });
  });

  fastify.addHook("onRequest", function onRequest(request, reply, done) {
    if (settings.accessLogFilter != undefined && !settings.accessLogFilter(request)) {
      done();

      return;
    }

    const requestInfo = getRequestInfo(request);
    request.traceId = requestInfo.traceID;
    request.operationId = requestInfo.operationId;
    logger.info({ info: requestInfo, message: "receive request" });

    settings.onRequest?.(request, reply);

    done();
  });
  fastify.addHook("onSend", async function onSend(request, reply, payload) {
    reply.header("traceId", request.traceId);
    reply.header("operationId", request.operationId);

    await settings.onSend?.(request, reply, payload);

    return payload;
  });
  fastify.addHook("onResponse", function onResponse(request, reply, done) {
    if (settings.accessLogFilter != undefined && !settings.accessLogFilter(request)) {
      done();

      return;
    }

    const requestInfo = getRequestInfo(request);
    const responseInfo = getResponseInfo(reply);

    settings.onResponse?.(request, reply);

    logger.info({
      info: {
        ...requestInfo,
        ...responseInfo,
      },
      message: "send response",
    });

    done();
  });
}
