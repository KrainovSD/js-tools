import { FastifyRequest } from 'fastify';
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const IncomingFileName = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    let incomingFileName: undefined | string;
    const type = ctx.getType();

    switch (type) {
      case 'http': {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        incomingFileName = request.incomingFileName;
        break;
      }
      default: {
        break;
      }
    }

    if (!incomingFileName) {
      switch (type) {
        case 'http': {
          throw new InternalServerErrorException("haven't incomingFileName");
        }
        default: {
          throw new InternalServerErrorException('unknown context type!');
        }
      }
    }

    return incomingFileName;
  },
);
