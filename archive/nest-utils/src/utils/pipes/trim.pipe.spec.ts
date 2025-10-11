import { ArgumentMetadata } from '@nestjs/common';
import { TrimPipe } from './trim.pipe';

describe('Trim pipe', () => {
  const trim = new TrimPipe();
  const object = {
    field1: ' test ',
    fieldDeep: {
      field2: 'test ',
      password: 'test ',
    },
  };

  it('trim query', () => {
    const metadata = {
      type: 'query',
    };
    const result = trim.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual({
      field1: object.field1.trim(),
      fieldDeep: {
        field2: object.fieldDeep.field2.trim(),
        password: object.fieldDeep.password,
      },
    });
  });
  it('trim params', () => {
    const metadata = {
      type: 'params',
    };
    const result = trim.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual({
      field1: object.field1.trim(),
      fieldDeep: {
        field2: object.fieldDeep.field2.trim(),
        password: object.fieldDeep.password,
      },
    });
  });
  it('trim body', () => {
    const metadata = {
      type: 'body',
    };
    const result = trim.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual({
      field1: object.field1.trim(),
      fieldDeep: {
        field2: object.fieldDeep.field2.trim(),
        password: object.fieldDeep.password,
      },
    });
  });
  it('trim fordbidden', () => {
    const metadata = {
      type: 'body',
    };
    const result = trim.transform(
      { ...object, mimetype: 'png' },
      metadata as ArgumentMetadata,
    );
    expect(result).toEqual({ ...object, mimetype: 'png' });
  });
  it('trim unknown', () => {
    const metadata = {
      type: 'unknown',
    };
    const result = trim.transform(object, metadata as ArgumentMetadata);
    expect(result).toEqual(object);
  });
});
