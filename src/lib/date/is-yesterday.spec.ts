import { getDateByRules } from "./get-date-by-rules";
import { isYesterday } from "./is-yesterday";

describe("is-yesterday", () => {
  it("today", () => {
    expect(isYesterday(new Date())).toBeFalsy();
  });
  it("yesterday", () => {
    expect(isYesterday(getDateByRules([{ increment: -1, type: "days" }]))).toBeTruthy();
  });
});
