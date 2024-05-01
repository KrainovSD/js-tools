import { FastifyRequest } from 'fastify';
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const TraceId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    let traceId: undefined | string;
    const type = ctx.getType();

    switch (type) {
      case 'http': {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        traceId = request.traceId;
        break;
      }
      case 'ws': {
        const client = ctx.switchToWs().getClient();
        traceId = client?.traceId;
        break;
      }
      default: {
        break;
      }
    }

    if (!traceId) {
      switch (type) {
        case 'http': {
          throw new InternalServerErrorException("haven't traceId");
        }
        case 'ws': {
          let WebsocketException: undefined | ErrorConstructor;
          try {
            const { WsException } = await import('@nestjs/websockets');
            if (WsException) {
              WebsocketException = WsException as unknown as ErrorConstructor;
            }
          } catch {
            /* empty */
          }
          if (WebsocketException)
            return new WebsocketException("haven't traceId");
          throw new InternalServerErrorException("haven't traceId");
        }
        default: {
          throw new InternalServerErrorException('unknown context type!');
        }
      }
    }

    return traceId;
  },
);
