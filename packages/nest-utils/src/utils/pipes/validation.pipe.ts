import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { typings } from '@krainovsd/utils';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ValidationException,
  ValidationExceptionMessage,
} from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (metadata.metatype && metadata.type !== 'custom' && value) {
      const obj = plainToInstance(metadata.metatype, value);
      const errors = await validate(obj, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length) {
        const messages = errors.reduce(
          (result: ValidationExceptionMessage, err) => {
            if (!err.property) return result;
            result[err.property] = typings.isObject(err.constraints)
              ? [...Object.values(err.constraints)]
              : ['not valid'];
            return result;
          },
          {},
        );
        throw new ValidationException(messages, JSON.stringify(value));
      }
    }
    return value;
  }
}
