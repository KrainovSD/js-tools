import { FastifyReply, FastifyRequest } from 'fastify';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { LOGGER_PROVIDER_MODULE } from './logger.constants';
import { Client, RpcData } from './typings';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_PROVIDER_MODULE)
    private readonly loggerService: LoggerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const type = context.getType();

    switch (type) {
      case 'rpc': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.interceptRpc(context, next);
      }
      case 'http': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.interceptHttp(context, next);
      }
      case 'ws': {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.interceptWs(context, next);
      }
      default: {
        return next.handle();
      }
    }
  }

  public async interceptHttp(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();
    const requestInfo = await this.loggerService.getRequestInfo(request);
    if (!request.operationId) request.operationId = requestInfo.operationId;
    this.loggerService.info({ info: requestInfo, message: 'start request' });

    return next.handle().pipe(
      tap(() => {
        this.loggerService.info({
          info: { ...requestInfo, status: response.statusCode },
          message: 'end request',
        });
      }),
    );
  }
  public async interceptRpc(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToRpc();
    const data = ctx.getData<RpcData>();
    const rpcContext = ctx.getContext<Record<string, unknown>>();
    const eventInfo = {
      pattern:
        typeof rpcContext?.getPattern === 'function'
          ? rpcContext?.getPattern?.()
          : undefined,
      operationId: data?.operationId,
      sender: data?.sender,
    };
    this.loggerService.info({ info: eventInfo, message: 'start rpc event' });

    return next.handle().pipe(
      tap(() => {
        const channel =
          typeof rpcContext?.getChannelRef === 'function'
            ? rpcContext?.getChannelRef()
            : undefined;
        const originalMsg =
          typeof rpcContext?.getMessage === 'function'
            ? rpcContext?.getMessage()
            : undefined;
        channel?.ack?.(originalMsg);

        this.loggerService.info({ info: eventInfo, message: 'end rpc event' });
      }),
    );
  }
  public async interceptWs(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToWs();

    const client = ctx.getClient<Client>();
    const pattern = ctx.getPattern();
    // const body = JSON.stringify(ctx.getData());
    const socketInfo = await this.loggerService.getSocketInfo(client);
    if (!client.operationId) client.traceId = socketInfo.operationId;

    this.loggerService.info({
      info: { ...socketInfo, pattern },
      message: 'start socket event',
    });

    return next.handle().pipe(
      tap(() => {
        this.loggerService.info({
          info: { ...socketInfo, pattern },
          message: 'end socket event',
        });
        client.operationId = undefined;
      }),
    );
  }
}
