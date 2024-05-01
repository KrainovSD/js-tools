import { typings } from '@krainovsd/utils';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformToNumberPipe implements PipeTransform {
  private transformToInt(str: string) {
    return Number.isNaN(+str) ? null : +str;
  }

  transform(obj: unknown, metadata: ArgumentMetadata): unknown {
    if (
      (metadata.type === 'param' || metadata.type === 'query') &&
      typings.isObject(obj)
    ) {
      for (const key in obj) {
        const value = obj[key];
        if (typings.isString(value)) {
          const transformed = this.transformToInt(value);
          if (typings.isNumber(transformed)) {
            obj[key] = transformed;
          }
        }
      }
    }
    return obj;
  }
}
