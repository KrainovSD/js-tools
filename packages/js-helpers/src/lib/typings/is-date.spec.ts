import { isDate } from "./is-date";

describe("is-date", () => {
  it("date", () => {
    expect(isDate(new Date())).toBeTruthy();
  });
  it("not date", () => {
    expect(isDate(232)).toBeFalsy();
  });
});
