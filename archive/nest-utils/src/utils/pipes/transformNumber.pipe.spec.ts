import { ArgumentMetadata } from '@nestjs/common';
import { TransformToNumberPipe } from './transformNumber.pipe';

describe('Transform Number Pipe', () => {
  const transform = new TransformToNumberPipe();
  const object = {
    field1: '1',
    field2: '0',
    field3: 20,
  };

  it('transform param', () => {
    const metadata = {
      type: 'param',
    };
    const result = transform.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual({
      field1: +object.field1,
      field2: +object.field2,
      field3: object.field3,
    });
  });

  it('transform query', () => {
    const metadata = {
      type: 'query',
    };
    const result = transform.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual({
      field1: +object.field1,
      field2: +object.field2,
      field3: object.field3,
    });
  });
  it('transform unknown', () => {
    const metadata = {
      type: 'unknown',
    };
    const result = transform.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual(object);
  });
});
