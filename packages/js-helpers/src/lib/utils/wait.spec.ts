import { wait } from "./wait";

describe("wait", () => {
  it("success wait", async () => {
    const delay = 1000;
    const start = Date.now();
    await wait(delay);
    const end = Date.now();
    expect(end - start).toBeGreaterThan(delay - 1);
  });
});
