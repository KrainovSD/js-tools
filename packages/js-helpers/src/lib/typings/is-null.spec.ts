import { isNull } from "./is-null";

describe("is-null", () => {
  it("undefined", () => {
    expect(isNull(undefined)).toBeFalsy();
  });
  it("null", () => {
    expect(isNull(null)).toBeTruthy();
  });
});
