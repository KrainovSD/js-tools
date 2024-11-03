import { isNullable } from "./is-nullable";

describe("is-nullable", () => {
  it("undefined", () => {
    expect(isNullable(undefined)).toBeTruthy();
  });
  it("null", () => {
    expect(isNullable(null)).toBeTruthy();
  });
  it("boolean", () => {
    expect(isNullable(false)).toBeFalsy();
  });
});
