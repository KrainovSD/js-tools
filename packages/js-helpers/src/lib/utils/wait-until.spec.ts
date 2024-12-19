import { waitUntil } from "./wait-until";

describe("wait-until", () => {
  it("success wait", async () => {
    const delay = 1000;
    const start = Date.now();
    let wait = true;

    setTimeout(() => {
      wait = false;
    }, delay);

    await waitUntil(() => {
      return wait;
    });
    const end = Date.now();
    expect(end - start).toBeGreaterThan(delay - 1);
  });
});
