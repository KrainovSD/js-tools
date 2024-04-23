import { typings } from '@krainovsd/utils';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { throwError } from 'rxjs';
import { Client, RpcData } from './typings';

import { LOGGER_PROVIDER_MODULE } from './logger.constants';
import { LoggerService } from './logger.service';

@Catch()
export class LoggerFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_PROVIDER_MODULE)
    private readonly loggerService: LoggerService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType();

    switch (type) {
      case 'rpc': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.rpcFilter(exception, host);
      }
      case 'http': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.httpFilter(exception, host);
      }
      case 'ws': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.wsFilter(exception, host);
      }
      default: {
        return this.loggerService.error({
          message: 'strange type host',
          error: exception,
        });
      }
    }
  }

  private async httpFilter(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const requestInfo = await this.loggerService.getRequestInfo(request);
    const errorInfo = this.loggerService.getErrorInfo(exception);
    const status = errorInfo.status || 500;

    this.loggerService.error({
      info: { ...requestInfo, ...errorInfo, status },
      message: 'request error',
    });

    if (requestInfo.traceId) {
      response.header('traceId', requestInfo.traceId);
    }

    return response
      .status(status)
      .header('operationId', requestInfo.operationId)
      .send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        traceId: requestInfo.traceId,
        operationId: requestInfo.operationId,
        path: requestInfo.url,
        message: errorInfo.error,
        description: errorInfo.description,
      });
  }
  private async rpcFilter(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData<RpcData>();
    const rpcContext = ctx.getContext<Record<string, unknown>>();
    const errorInfo = this.loggerService.getErrorInfo(exception);
    const eventInfo = {
      pattern:
        typeof rpcContext?.getPattern === 'function'
          ? rpcContext?.getPattern?.()
          : undefined,
      operationId: data?.operationId,
      sender: data?.sender,
      traceId: await this.loggerService.getTraceId(),
    };

    this.loggerService.error({
      info: { ...eventInfo, ...errorInfo },
      message: 'error rpc event',
    });
    return throwError(() => ({ status: 'error', message: errorInfo.error }));
  }
  private async wsFilter(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Client>();
    const pattern = ctx.getPattern();
    // const body = JSON.stringify(ctx.getData());

    const socketInfo = await this.loggerService.getSocketInfo(client);
    const errorInfo = this.loggerService.getErrorInfo(exception);
    const status =
      !errorInfo.status ||
      errorInfo.status === HttpStatus.INTERNAL_SERVER_ERROR ||
      errorInfo.status < 1000
        ? 1011
        : errorInfo.status;
    const reason = JSON.stringify({
      name: errorInfo.error,
      description: errorInfo.description,
      operationId: socketInfo.operationId,
      traceId: socketInfo.traceId,
    });

    this.loggerService.error({
      info: {
        ...socketInfo,
        pattern: !typings.isString(pattern) ? JSON.stringify(pattern) : pattern,
        ...errorInfo,
        status,
      },
      message: 'error ws event',
    });

    if (typeof client.close === 'function') client.close(status, reason);

    let WebsokcetException: undefined | ErrorConstructor;
    try {
      const { WsException } = await import('@nestjs/websockets');
      if (WsException) {
        WebsokcetException = WsException as unknown as ErrorConstructor;
      }
    } catch {
      /* empty */
    }
    if (WebsokcetException) return new WebsokcetException(reason);
    return null;
  }
}
