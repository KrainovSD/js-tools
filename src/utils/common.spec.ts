import common from './common';

describe('Common test', () => {
  describe('checkIrregularVerb', () => {
    it('irregular', () => {
      expect(common.checkIrregularVerb('blow--blew--blown')).toBeTruthy();
    });
    it('string', () => {
      expect(common.checkIrregularVerb('car')).toBeFalsy();
    });
    it('irregular with extra symbols', () => {
      expect(common.checkIrregularVerb('blow--blew--blown--')).toBeTruthy();
    });
    it('bad irregular', () => {
      expect(common.checkIrregularVerb('blow--blew--')).toBeFalsy();
    });
  });
  describe('updateNewValue', () => {
    it('update value', () => {
      const oldObj = { name: 1, age: 2, gender: 3 };
      const newObj = { name: 1, age: 4, gender: 3 };
      common.updateNewValue(oldObj, newObj);
      expect(oldObj).toEqual({
        name: 1,
        age: 4,
        gender: 3,
      });
    });
    it('update one value', () => {
      const oldObj = { name: 1, age: 2, gender: 3 };
      const newObj = { age: 4 };
      common.updateNewValue(oldObj, newObj);

      expect(oldObj).toEqual({
        name: 1,
        age: 4,
        gender: 3,
      });
    });
    it('update value with exception', () => {
      const oldObj = { name: 1, age: 2, gender: 3 };
      const newObj = { name: 2, age: 3, gender: 4 };
      const exception = ['name', 'age'];
      common.updateNewValue(oldObj, newObj, exception);
      expect(oldObj).toEqual({
        name: 1,
        age: 2,
        gender: 4,
      });
    });
  });
  describe('getRandomId', () => {
    it('size', () => {
      const id = common.getRandomId(5);
      expect(id.length === 5).toBeTruthy();
    });
  });
  describe('safeJsonParse', () => {
    it('object', () => {
      const json = JSON.stringify({ test: 2 });
      expect(common.safeJsonParse(json)).not.toBeNull();
    });
    it('bad json', () => {
      const json = '{test: 2}';
      expect(common.safeJsonParse(json)).toBeNull();
    });
  });
  describe('getRandomNumber', () => {
    const min = 0;
    const max = 10;

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('floor', () => {
      const mathRandomSpy = jest.spyOn(Math, 'random');
      mathRandomSpy.mockImplementation(() => 0);
      const floor = common.getRandomNumber(min, max);
      expect(floor).toBe(min);
    });
    it('ceiling', () => {
      const mathRandomSpy = jest.spyOn(Math, 'random');
      mathRandomSpy.mockImplementation(() => 1);
      const floor = common.getRandomNumber(min, max);
      expect(floor).toBe(max);
    });
  });
});
