import { typings } from '@krainovsd/utils';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private readonly exceptFields = ['password'];
  private readonly forbiddenFields = ['mimetype'];

  private isHasForbiddenField(value: Record<string, unknown>) {
    return this.forbiddenFields.some((field) => field in value);
  }
  private isCorretObject(value: unknown): value is Record<string, unknown> {
    return typings.isObject(value) && !this.isHasForbiddenField(value);
  }
  private isNotExceptField(value: string) {
    return !this.exceptFields.includes(value);
  }
  private trim(obj: Record<string, unknown>) {
    for (const key in obj) {
      if (this.isNotExceptField(key) && typings.isString(obj[key]))
        obj[key] = (obj[key] as string).trim();
      if (this.isCorretObject(obj[key])) {
        obj[key] = this.trim(obj[key] as Record<string, unknown>);
      }
    }
    return obj;
  }

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (
      (metadata.type === 'body' ||
        metadata.type === 'param' ||
        metadata.type === 'query') &&
      this.isCorretObject(value)
    ) {
      return this.trim(value);
    }
    return value;
  }
}
