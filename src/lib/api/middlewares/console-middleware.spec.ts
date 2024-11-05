import { consoleMiddleware } from "./console-middleware";

describe("console-middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("success", async () => {
    const spyLog = jest.spyOn(console, "log");

    await consoleMiddleware({ method: "DELETE", path: "" });

    expect(spyLog).toHaveBeenCalledTimes(1);
  });
});
