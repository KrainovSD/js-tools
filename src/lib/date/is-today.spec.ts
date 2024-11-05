import { getDateByRules } from "./get-date-by-rules";
import { isToday } from "./is-today";

describe("is-today", () => {
  it("today", () => {
    expect(isToday(new Date())).toBeTruthy();
  });
  it("tomorrow", () => {
    expect(isToday(getDateByRules([{ increment: 1, type: "days" }]))).toBeFalsy();
  });
  it("error", () => {
    expect(isToday({} as Date)).toBeFalsy();
  });
});
