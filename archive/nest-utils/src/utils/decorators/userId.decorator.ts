import { FastifyRequest } from 'fastify';
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    let userId: undefined | string;
    const type = ctx.getType();

    switch (type) {
      case 'http': {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        userId = request.user?.id;
        break;
      }
      case 'ws': {
        const client = ctx.switchToWs().getClient();
        userId = client?.user?.id;
        break;
      }
      default: {
        break;
      }
    }

    if (!userId) {
      switch (type) {
        case 'http': {
          throw new InternalServerErrorException("haven't userId");
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
            return new WebsocketException("haven't userId");
          throw new InternalServerErrorException("haven't userId");
        }
        default: {
          throw new InternalServerErrorException('unknown context type!');
        }
      }
    }

    return userId;
  },
);
