import { randomNumber } from "./random-number";

describe("random-number", () => {
  it("success", () => {
    const testCases = 1000;
    const min = 0;
    const max = 10;

    for (let i = 0; i < testCases; i++) {
      const number = randomNumber(min, max);
      expect(number).toBeLessThan(max + 1);
      expect(number).toBeGreaterThan(min - 1);
    }
  });
});
