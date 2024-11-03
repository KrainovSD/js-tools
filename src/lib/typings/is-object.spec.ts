import { isObject } from "./is-object";

describe("is-object", () => {
  it("object", () => {
    expect(isObject({})).toBeTruthy();
  });
  it("array", () => {
    expect(isObject([])).toBeFalsy();
  });
  it("string", () => {
    expect(isObject("")).toBeFalsy();
  });
});
