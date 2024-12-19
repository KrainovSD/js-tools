import { getToday } from "./get-today";
import { isToday } from "./is-today";

describe("get-today", () => {
  it("check", () => {
    const { startToday, endToday } = getToday();
    expect(isToday(startToday) && isToday(endToday)).toBeTruthy();
  });
});
