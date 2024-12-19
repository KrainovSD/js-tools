import { isString } from "./is-string";

describe("is-string", () => {
  it("string", () => {
    expect(isString("string")).toBeTruthy();
  });
  it("empty string", () => {
    expect(isString("")).toBeTruthy();
  });
  it("not string", () => {
    expect(isString(2)).toBeFalsy();
  });
});
