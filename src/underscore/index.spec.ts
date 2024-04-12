import underscore from './index';

describe('underscore test', () => {
  describe('get', () => {
    it('get simple', () => {
      const object = { test: 2 };
      expect(underscore.get(object, 'test')).toBe(2);
    });
    it('get hard', () => {
      const object = { test: { array: [{ bar: 2 }] } };
      expect(underscore.get(object, 'test.array[0].bar')).toBe(2);
    });
    it('get nothing', () => {
      const object = { test: 2 };
      expect(underscore.get(object, 'rest')).toBeNull();
    });
    it('get custom nothing', () => {
      const object = { test: 2 };
      expect(underscore.get(object, 'rest', 3)).toBe(3);
    });
  });
});
