import { isArray } from "./is-array";

describe("is-array", () => {
  it("object", () => {
    expect(isArray({})).toBeFalsy();
  });
  it("array", () => {
    expect(isArray([])).toBeTruthy();
  });
  it("string", () => {
    expect(isArray("")).toBeFalsy();
  });
});
