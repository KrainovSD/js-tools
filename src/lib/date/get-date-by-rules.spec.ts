import { getDateByRules } from "./get-date-by-rules";

describe("get-date-by-rules", () => {
  const dayDiff = 86400000;
  const hourDiff = 3600000;
  const minuteDiff = 60000;
  const secondDiff = 1000;

  it("1 second 1 hour 1 minute 1 day", () => {
    const now = new Date();
    const future = getDateByRules(
      [
        { increment: 1, type: "seconds" },
        { increment: 1, type: "minutes" },
        { increment: 1, type: "hours" },
        { increment: 1, type: "days" },
      ],
      now,
    );
    expect(future.getTime() - now.getTime()).toBe(secondDiff + minuteDiff + hourDiff + dayDiff);
  });
});
