import date from './date';

describe('Date test', () => {
  describe('getDate', () => {
    const dayDiff = 86400000;
    const hourDiff = 3600000;
    const minuteDiff = 60000;
    const secondDiff = 1000;
    it('one day', () => {
      const now = new Date();
      const tomorrow = date.getDate(1, 'days', now);
      expect(tomorrow.getTime() - now.getTime()).toBe(dayDiff);
    });
    it('one hours', () => {
      const now = new Date();
      const future = date.getDate(1, 'hours', now);
      expect(future.getTime() - now.getTime()).toBe(hourDiff);
    });
    it('one minute', () => {
      const now = new Date();
      const future = date.getDate(1, 'minutes', now);
      expect(future.getTime() - now.getTime()).toBe(minuteDiff);
    });
    it('one second', () => {
      const now = new Date();
      const future = date.getDate(1, 'seconds', now);
      expect(future.getTime() - now.getTime()).toBe(secondDiff);
    });
  });
  describe('getDateByMultipleRule', () => {
    const dayDiff = 86400000;
    const hourDiff = 3600000;
    const minuteDiff = 60000;
    const secondDiff = 1000;
    it('1 second 1 hour 1 minute 1 day', () => {
      const now = new Date();
      const future = date.getDateByMultipleRule(
        [
          { increment: 1, type: 'seconds' },
          { increment: 1, type: 'minutes' },
          { increment: 1, type: 'hours' },
          { increment: 1, type: 'days' },
        ],
        now,
      );
      expect(future.getTime() - now.getTime()).toBe(
        secondDiff + minuteDiff + hourDiff + dayDiff,
      );
    });
  });

  describe('isToday', () => {
    it('today', () => {
      expect(date.isToday(new Date())).toBeTruthy();
    });
    it('tomorrow', () => {
      expect(date.isToday(date.getDate(1, 'days'))).toBeFalsy();
    });
  });
  describe('isYesterday', () => {
    it('today', () => {
      expect(date.isYesterday(new Date())).toBeFalsy();
    });
    it('yesterday', () => {
      expect(date.isYesterday(date.getDate(-1, 'days'))).toBeTruthy();
    });
  });
  describe('isTomorrow', () => {
    it('today', () => {
      expect(date.isTomorrow(new Date())).toBeFalsy();
    });
    it('tomorrow', () => {
      expect(date.isTomorrow(date.getDate(1, 'days'))).toBeTruthy();
    });
  });

  describe('differenceDate', () => {
    it('1 day', () => {
      const now = new Date();
      expect(date.differenceDate('days', date.getDate(1, 'days', now))).toBe(1);
    });
    it('1 hour', () => {
      const now = new Date();
      expect(date.differenceDate('hours', date.getDate(1, 'hours', now))).toBe(
        1,
      );
    });
    it('1 minute', () => {
      const now = new Date();
      expect(
        date.differenceDate('minutes', date.getDate(1, 'minutes', now)),
      ).toBe(1);
    });
    it('1 minute in seconds', () => {
      const now = new Date();
      expect(
        date.differenceDate('seconds', date.getDate(1, 'minutes', now)),
      ).toBe(60);
    });
    it('1 second', () => {
      const now = new Date();
      expect(
        date.differenceDate('seconds', date.getDate(1, 'seconds', now)),
      ).toBe(1);
    });
  });
  describe('getTomorrow', () => {
    it('check', () => {
      expect(date.isTomorrow(date.getTomorrow())).toBeTruthy();
    });
  });
  describe('getYesterday', () => {
    it('check', () => {
      expect(date.isYesterday(date.getYesterday())).toBeTruthy();
    });
  });
  describe('getToday', () => {
    it('check', () => {
      const { startToday, endToday } = date.getToday();
      expect(date.isToday(startToday) && date.isToday(endToday)).toBeTruthy();
    });
  });
});
