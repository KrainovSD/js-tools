import { generateMiddlewares } from ".";
import type { ActiveMiddleware, RequestInterface } from "../../../types";

describe("generate-middlewares", () => {
  it("success", async () => {
    const token = "TOKEN2";
    const request: RequestInterface<unknown, unknown, unknown, unknown> = {
      method: "GET",
      path: "http://test",
      token,
      headers: {},
    };

    const middlewares = generateMiddlewares(
      ["logger", "auth", "test"] as ActiveMiddleware,
      {
        auth: {
          authUrl: "test",
          authTokenUrl: "test",
          pathToTokenExpires: "test",
          pathToToken: "test",
          storageTokenExpiresName: "test",
          storageTokenName: "test",
          errorUrl: "/error",
        },
      },
      [],
    );
    await expect(middlewares(request)).resolves.toBe(1);
    expect(request.headers?.Authorization).toBe(`Bearer ${token}`);
  });
});
