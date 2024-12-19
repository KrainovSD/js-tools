import { isNumber } from "./is-number";

describe("is-number", () => {
  it("number zero", () => {
    expect(isNumber(0)).toBeTruthy();
  });
  it("number", () => {
    expect(isNumber(2)).toBeTruthy();
  });
  it("not number", () => {
    expect(isNumber("2")).toBeFalsy();
  });
});
