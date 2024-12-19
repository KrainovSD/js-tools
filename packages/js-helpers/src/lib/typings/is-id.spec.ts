import { isId } from "./is-id";

describe("is-id", () => {
  it("number zero", () => {
    expect(isId(0)).toBeTruthy();
  });
  it("number", () => {
    expect(isId(2)).toBeTruthy();
  });
  it("string", () => {
    expect(isId("string")).toBeTruthy();
  });
  it("empty string", () => {
    expect(isId("")).toBeTruthy();
  });
  it("not id", () => {
    expect(isId(true)).toBeFalsy();
  });
});
