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
  it("1 month, 1 year", () => {
    const now = new Date();
    const currentMonth = 10;
    const currentYear = 2020;
    now.setMonth(currentMonth);
    now.setFullYear(currentYear);

    const future = getDateByRules(
      [
        { increment: 1, type: "months" },
        { increment: 1, type: "years" },
      ],
      now,
    );
    expect(future.getFullYear()).toBe(currentYear + 1);
    expect(future.getMonth()).toBe(currentMonth + 1);
  });
});
