import { dateDifference } from "./date-difference";
import { getDateByRules } from "./get-date-by-rules";

describe("date-difference", () => {
  it("1 day", () => {
    const now = new Date();
    expect(
      dateDifference({
        type: "days",
        firstDate: getDateByRules([{ increment: 1, type: "days" }], now),
        secondDate: now,
      }),
    ).toBe(1);
  });
  it("1 hour", () => {
    const now = new Date();
    expect(
      dateDifference({
        type: "hours",
        firstDate: getDateByRules([{ increment: 1, type: "hours" }], now),
        secondDate: now,
      }),
    ).toBe(1);
  });
  it("1 minute", () => {
    const now = new Date();
    expect(
      dateDifference({
        type: "minutes",
        firstDate: getDateByRules([{ increment: 1, type: "minutes" }], now),
        secondDate: now,
      }),
    ).toBe(1);
  });
  it("1 minute in seconds", () => {
    const now = new Date();
    expect(
      dateDifference({
        type: "seconds",
        firstDate: getDateByRules([{ increment: 1, type: "minutes" }], now),
        secondDate: now,
      }),
    ).toBe(60);
  });
  it("1 second", () => {
    const now = new Date();
    expect(
      dateDifference({
        type: "seconds",
        firstDate: getDateByRules([{ increment: 1, type: "seconds" }], now),
        secondDate: now,
      }),
    ).toBe(1);
  });
});
