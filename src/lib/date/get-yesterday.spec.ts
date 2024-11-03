import { getYesterday } from "./get-yesterday";
import { isYesterday } from "./is-yesterday";

describe("get-yesterday", () => {
  it("check", () => {
    expect(isYesterday(getYesterday())).toBeTruthy();
  });
});
