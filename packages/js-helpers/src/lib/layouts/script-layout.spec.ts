import { ResponseError } from "../api";
import { wait } from "../utils";
import { scriptLayout } from "./script-layout";

describe("script-layout", () => {
  it("return action payload", async () => {
    const payload = 1;

    await expect(
      scriptLayout({
        action: async () => {
          await wait(0);

          return payload;
        },
      }),
    ).resolves.toBe(payload);
  });
  it("return response error", async () => {
    const message = "error";
    const status = 400;

    await expect(
      scriptLayout({
        action: async () => {
          await wait(0);

          throw new ResponseError({ message, status });
        },
      }),
    ).resolves.toEqual({ message, status });
  });
  it("return error", async () => {
    const error = "error";

    await expect(
      scriptLayout({
        action: async () => {
          await wait(0);

          throw new Error(error);
        },
      }),
    ).rejects.toThrow(error);
  });
});
