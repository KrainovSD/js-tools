import { randomString } from "./random-string";

describe("random-string", () => {
  it("success", () => {
    const allowCharacters = "ABCD";
    const length = 12;

    const string = randomString(length, allowCharacters);
    const uniqueCharacters = new Set(string.split(""));

    expect(string.length).toBe(length);
    expect(uniqueCharacters.size).toBeLessThanOrEqual(allowCharacters.length);
    expect(randomString().length).toBe(10);
  });
});
