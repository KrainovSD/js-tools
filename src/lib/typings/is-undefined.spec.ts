import { isUndefined } from "./is-undefined";

describe("is-undefined", () => {
  it("undefined", () => {
    expect(isUndefined(undefined)).toBeTruthy();
  });
  it("null", () => {
    expect(isUndefined(null)).toBeFalsy();
  });
});
