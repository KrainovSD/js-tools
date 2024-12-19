import { transformToNumber } from "./transform-to-number";

describe("transform-to-number", () => {
  it("parse string", () => {
    expect(transformToNumber("12px")).toBe(12);
  });
  it("parse boolean", () => {
    expect(transformToNumber(true)).toBe(1);
  });
  it("parse number", () => {
    expect(transformToNumber(13)).toBe(13);
  });
  it("parse object", () => {
    expect(transformToNumber({})).toBe(0);
  });
});
