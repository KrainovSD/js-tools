import { isBoolean } from "./is-boolean";

describe("is-boolean", () => {
  it("boolean", () => {
    expect(isBoolean(false)).toBeTruthy();
  });
  it("not boolean", () => {
    expect(isBoolean(0)).toBeFalsy();
  });
});
