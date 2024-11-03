import { dateDifference } from "./date-difference";
import { getDateByRules } from "./get-date-by-rules";

describe("date-difference", () => {
  it("1 day", () => {
    const now = new Date();
    expect(dateDifference("days", getDateByRules([{ increment: 1, type: "days" }], now), now)).toBe(
      1,
    );
  });
  it("1 hour", () => {
    const now = new Date();
    expect(
      dateDifference("hours", getDateByRules([{ increment: 1, type: "hours" }], now), now),
    ).toBe(1);
  });
  it("1 minute", () => {
    const now = new Date();
    expect(
      dateDifference("minutes", getDateByRules([{ increment: 1, type: "minutes" }], now), now),
    ).toBe(1);
  });
  it("1 minute in seconds", () => {
    const now = new Date();
    expect(
      dateDifference("seconds", getDateByRules([{ increment: 1, type: "minutes" }], now), now),
    ).toBe(60);
  });
  it("1 second", () => {
    const now = new Date();
    expect(
      dateDifference("seconds", getDateByRules([{ increment: 1, type: "seconds" }], now), now),
    ).toBe(1);
  });
});
