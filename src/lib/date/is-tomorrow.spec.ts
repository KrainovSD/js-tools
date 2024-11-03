import { getDateByRules } from "./get-date-by-rules";
import { isTomorrow } from "./is-tomorrow";

describe("is-tomorrow", () => {
  it("today", () => {
    expect(isTomorrow(new Date())).toBeFalsy();
  });
  it("tomorrow", () => {
    expect(isTomorrow(getDateByRules([{ increment: 1, type: "days" }]))).toBeTruthy();
  });
});
