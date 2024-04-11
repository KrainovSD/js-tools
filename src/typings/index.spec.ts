import typings from './index';

describe('Typings test', () => {
  describe('isString', () => {
    it('string', () => {
      expect(typings.isString('string')).toBeTruthy();
    });
    it('empty string', () => {
      expect(typings.isString('')).toBeTruthy();
    });
    it('not string', () => {
      expect(typings.isString(2)).toBeFalsy();
    });
  });
  describe('isNumber', () => {
    it('number zero', () => {
      expect(typings.isNumber(0)).toBeTruthy();
    });
    it('number', () => {
      expect(typings.isNumber(2)).toBeTruthy();
    });
    it('not number', () => {
      expect(typings.isNumber('2')).toBeFalsy();
    });
  });
  describe('isId', () => {
    it('number zero', () => {
      expect(typings.isId(0)).toBeTruthy();
    });
    it('number', () => {
      expect(typings.isId(2)).toBeTruthy();
    });
    it('string', () => {
      expect(typings.isId('string')).toBeTruthy();
    });
    it('empty string', () => {
      expect(typings.isId('')).toBeTruthy();
    });
    it('not id', () => {
      expect(typings.isId(true)).toBeFalsy();
    });
  });
  describe('isBoolean', () => {
    it('boolean', () => {
      expect(typings.isBoolean(false)).toBeTruthy();
    });
    it('not boolean', () => {
      expect(typings.isBoolean(0)).toBeFalsy();
    });
  });
  describe('isObject', () => {
    it('object', () => {
      expect(typings.isObject({})).toBeTruthy();
    });
    it('array', () => {
      expect(typings.isObject([])).toBeFalsy();
    });
    it('string', () => {
      expect(typings.isObject('')).toBeFalsy();
    });
  });
  describe('isArray', () => {
    it('object', () => {
      expect(typings.isArray({})).toBeFalsy();
    });
    it('array', () => {
      expect(typings.isArray([])).toBeTruthy();
    });
    it('string', () => {
      expect(typings.isArray('')).toBeFalsy();
    });
  });
  describe('isUndefined', () => {
    it('undefined', () => {
      expect(typings.isUndefined(undefined)).toBeTruthy();
    });
    it('null', () => {
      expect(typings.isUndefined(null)).toBeFalsy();
    });
  });
  describe('isNull', () => {
    it('undefined', () => {
      expect(typings.isNull(undefined)).toBeFalsy();
    });
    it('null', () => {
      expect(typings.isNull(null)).toBeTruthy();
    });
  });
  describe('isNullable', () => {
    it('undefined', () => {
      expect(typings.isNullable(undefined)).toBeTruthy();
    });
    it('null', () => {
      expect(typings.isNullable(null)).toBeTruthy();
    });
    it('boolean', () => {
      expect(typings.isNullable(false)).toBeFalsy();
    });
  });
  describe('custom', () => {
    it('true', () => {
      expect(typings.custom(2, typings.isNumber(2))).toBeTruthy();
    });
    it('false', () => {
      expect(typings.custom(2, typings.isString(2))).toBeFalsy();
    });
  });
});
