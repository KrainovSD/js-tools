import { checkType } from "./check-type";

describe("check-type", () => {
  const value = 2;

  it("true", () => {
    expect(checkType(value, typeof value === "number")).toBeTruthy();
  });
  it("false", () => {
    expect(checkType(value, typeof value === "string")).toBeFalsy();
  });
});
