import { logfmtGetter } from './logfmtGetter';

describe('LogfmtGetter', () => {
  it('denied properties', () => {
    const result = logfmtGetter({ field: 'test', result: 'test' }, ['field']);
    expect(result).toMatch('result');
    expect(result).not.toMatch('field');
  });
  it('undefind values', () => {
    const result = logfmtGetter({ field: undefined, result: 'test' });
    expect(result).toMatch('result');
    expect(result).not.toMatch('field');
  });
  it('all values', () => {
    const result = logfmtGetter({ field: 'test', result: 'test' });
    expect(result).toMatch('result');
    expect(result).toMatch('field');
  });
});
