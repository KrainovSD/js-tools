import { FastifyRequest } from 'fastify';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  mixin,
  Type,
} from '@nestjs/common';
import { utils } from '@krainovsd/utils';
import { Observable } from 'rxjs';

type TUploadInterceptor = {
  fieldName: string;
  mimeTypes: RegExp;
  limits: number;
};

export function UploadInterceptor({
  fieldName,
  limits,
  mimeTypes,
}: TUploadInterceptor) {
  class UploadInterceptorClass implements NestInterceptor {
    async intercept(
      ctx: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      if (!fieldName)
        throw new BadRequestException("File field doesn't exist.");

      const req = ctx.switchToHttp().getRequest() as FastifyRequest;
      const isMultipart = req.isMultipart();
      if (!isMultipart) throw new BadRequestException("Isn't formdata.");

      const file = await req.file({
        limits: {
          fileSize: limits,
        },
      });

      if (!file) throw new BadRequestException("Hasn't file");
      if (fieldName.toLowerCase() !== file.fieldname.toLowerCase())
        throw new BadRequestException('Not expected file field');
      if (!mimeTypes.test(file.mimetype))
        throw new BadRequestException('Not expected mimetype');

      const buffer = await file.toBuffer();
      const fileName = `${fieldName}-${utils.common.getRandomId(
        10,
      )}.${file.filename.split('.').pop()}`;

      req.incomingFile = {
        name: fileName,
        payload: buffer,
      };

      return next.handle();
    }
  }
  const Interceptor = mixin(UploadInterceptorClass);
  return Interceptor as Type<NestInterceptor>;
}
