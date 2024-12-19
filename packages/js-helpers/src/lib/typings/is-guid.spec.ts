import { isGuid } from "./is-guid";

describe("is-guid", () => {
  it("guid", () => {
    expect(isGuid("f72ccac3-df0f-40a6-9780-caca90b492dd")).toBeTruthy();
  });
  it("not guid", () => {
    expect(isGuid("f72ccac3-df0f-40a6-9780-caca90b492d")).toBeFalsy();
  });
  it("empty", () => {
    expect(isGuid("")).toBeFalsy();
  });
  it("no string", () => {
    expect(isGuid(2)).toBeFalsy();
  });
});
