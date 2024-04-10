import typings from './index';

describe('Typings test', () => {
  describe('isString', () => {
    it('string', () => {
      expect(typings.isString('string')).toBeTruthy();
    });
    it('empty string', () => {
      expect(typings.isString('')).toBeFalsy();
    });
    it('not string', () => {
      expect(typings.isString(2)).toBeFalsy();
    });
  });
});
