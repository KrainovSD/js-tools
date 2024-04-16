import { FastifyRequest } from 'fastify';
import { typings } from '@krainovsd/utils';
import { v4 } from 'uuid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { trace } from '@opentelemetry/api';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import {
  Client,
  DebugOptions,
  ErrorOptions,
  InfoOptions,
  WarnOptions,
} from './typings';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  debug({ info = {}, message = 'debug', error }: DebugOptions) {
    const errorInfo = error ? this.getErrorInfo(error) : {};
    this.logger.debug(message, { ...info, ...errorInfo });
  }
  info({ info = {}, message = 'info' }: InfoOptions) {
    this.logger.info(message, info);
  }
  warn({ info = {}, message = 'warn', error }: WarnOptions) {
    const errorInfo = error ? this.getErrorInfo(error) : {};
    this.logger.warn(message, { ...info, ...errorInfo });
  }
  error({ error, info = {}, message = 'error' }: ErrorOptions) {
    const errorInfo = error ? this.getErrorInfo(error) : {};
    this.logger.error(message, { ...info, ...errorInfo });
  }

  async getRequestInfo(request: FastifyRequest) {
    console.log(trace);

    let traceId: undefined | string;
    try {
      const { trace } = await import('@opentelemetry/api');
      if (trace) {
        traceId = trace?.getActiveSpan()?.spanContext()?.traceId ?? undefined;
      }
    } catch {
      /* empty */
    }
    const ip = request.ip;
    const host = request.hostname;
    const url = request.url;
    const userId = request.user?.id;
    const operationId = request.operationId ?? v4();

    return { ip, host, url, userId, operationId, traceId };
  }
  getErrorInfo(err: unknown) {
    if (typings.isObject(err) && typings.isObject(err?.error)) {
      err = err.error;
    }

    const error = typings.isObject(err) ? err?.message : undefined;
    const description =
      typings.isObject(err) && typings.isObject(err?.messages)
        ? JSON.stringify(err.messages)
        : undefined;
    const name =
      typings.isObject(err) && typings.isString(err?.name)
        ? err?.name
        : undefined;
    const stack =
      typings.isObject(err) && typings.isString(err?.stack)
        ? err?.stack
        : undefined;
    const status =
      typings.isObject(err) && typings.isNumber(err?.status)
        ? err.status
        : undefined;

    return { error, name, description, stack, status };
  }
  getSocketInfo(client: Client) {
    return {
      userId: client.user?.id,
      operationId: client.operationId ?? v4(),
      sessionId: client.id,
    };
  }
}
