import { dateFormat } from "./date-format";

describe("date-format", () => {
  it("format", () => {
    const year = 2020;
    const month = 11;
    const day = 10;
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);

    expect(dateFormat(date, "YYYY-MM-DD")).toBe(`${year}-${month + 1}-${day}`);
  });
  it("not valid", () => {
    expect(dateFormat({} as Date, "YYYY-MM-DD")).toBe("");
  });
});
