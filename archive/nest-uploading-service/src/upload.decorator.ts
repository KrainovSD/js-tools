import { FastifyRequest } from 'fastify';
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const IncomingFile = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    let incomingFile: undefined | IncomingFile;
    const type = ctx.getType();

    switch (type) {
      case 'http': {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        incomingFile = request.incomingFile;
        break;
      }
      default: {
        break;
      }
    }

    if (!incomingFile && type === 'http') {
      throw new InternalServerErrorException("hasn't incomingFile");
    }

    return incomingFile;
  },
);
