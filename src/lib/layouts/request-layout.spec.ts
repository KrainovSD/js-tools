import { ResponseError } from "../api";
import { wait } from "../utils";
import { requestLayout } from "./request-layout";

describe("request-layout", () => {
  it("return action payload", async () => {
    const payload = 1;

    await expect(
      requestLayout({
        action: async () => {
          await wait(0);

          return payload;
        },
        setCode: () => {},
      }),
    ).resolves.toBe(payload);
  });
  it("return response error", async () => {
    const message = "error";
    const status = 400;
    let recievedStatus = 0;

    await expect(
      requestLayout({
        action: async () => {
          await wait(0);

          throw new ResponseError({ message, status });
        },
        setCode: (status) => {
          recievedStatus = status;
        },
      }),
    ).resolves.toEqual({ message });
    expect(recievedStatus).toBe(status);
  });
  it("return error", async () => {
    const error = "error";

    await expect(
      requestLayout({
        action: async () => {
          await wait(0);

          throw new Error(error);
        },
        setCode: () => {},
      }),
    ).rejects.toThrow(error);
  });
});
