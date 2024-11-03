import { getTomorrow } from "./get-tomorrow";
import { isTomorrow } from "./is-tomorrow";

describe("get-tomorrow", () => {
  it("check", () => {
    expect(isTomorrow(getTomorrow())).toBeTruthy();
  });
});
