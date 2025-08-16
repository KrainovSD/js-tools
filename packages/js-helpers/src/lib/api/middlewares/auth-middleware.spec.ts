import type { AuthMiddleWareOptions, RequestInterface } from "../../../types";
import { wait } from "../../utils";
import { generateAuthMiddleWare } from "./auth-middleware";

describe("auth-middleware", () => {
  const options: AuthMiddleWareOptions = {
    oauthUrl: () => "https://jestjs.io/api/auth/callback",
    authTokenUrl: "https://jestjs.io/api/auth/token",
    pathToTokenExpires: "expires",
    pathToToken: "token",
    expiresTokenStorageName: "expires",
    tokenStorageName: "token",
    errorUrl: "/error",
  };
  const data = {
    expires: Date.now() + 10 ** 8,
    token: "TOKEN",
  };
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: (path: string) => {
        if (path === options.expiresTokenStorageName) return data.expires;
        if (path === options.tokenStorageName) return data.token;

        return null;
      },
      setItem: () => {},
    },
  });
  const spyGetItem = jest.spyOn(global.localStorage, "getItem");
  const spySetItem = jest.spyOn(global.localStorage, "setItem");

  let REQUEST_SAME_ORIGIN: RequestInterface<unknown, unknown, unknown, unknown> = {
    method: "GET",
    path: "test",
    headers: {},
  };
  let REQUEST_NO_SAME_ORIGIN: RequestInterface<unknown, unknown, unknown, unknown> = {
    method: "GET",
    path: "http://test",
    headers: {},
  };

  beforeEach(() => {
    REQUEST_SAME_ORIGIN = {
      method: "GET",
      path: "test",
      headers: {},
    };
    REQUEST_NO_SAME_ORIGIN = {
      method: "GET",
      path: "http://test",
      headers: {},
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("without options", async () => {
    const middleware = generateAuthMiddleWare({} as unknown as AuthMiddleWareOptions);
    await middleware(REQUEST_NO_SAME_ORIGIN);
    expect(REQUEST_NO_SAME_ORIGIN.headers?.Authorization).toBeUndefined();
  });

  it("no same  origin with custom token", async () => {
    const CUSTOM_REQUEST = {
      ...REQUEST_NO_SAME_ORIGIN,
      token: "TOKEN2",
    };

    const middleware = generateAuthMiddleWare(options);
    await middleware(CUSTOM_REQUEST);
    expect(CUSTOM_REQUEST.headers?.Authorization).toBe(`Bearer ${CUSTOM_REQUEST.token}`);
  });

  it("token from localStorage no same origin", async () => {
    const middleware = generateAuthMiddleWare(options);
    await middleware(REQUEST_NO_SAME_ORIGIN);
    expect(REQUEST_NO_SAME_ORIGIN.headers?.Authorization).toBe(`Bearer ${data.token}`);
    expect(spyGetItem).toHaveBeenCalledTimes(2);
  });

  it("token from localStorage same origin", async () => {
    const middleware = generateAuthMiddleWare(options);
    await middleware(REQUEST_SAME_ORIGIN);
    expect(REQUEST_SAME_ORIGIN.headers?.Authorization).toBeUndefined();
    expect(spyGetItem).toHaveBeenCalledTimes(2);
  });

  it("token from fetch", async () => {
    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: true,
          status: 200,
          json: async () => {
            await wait(0);

            return data;
          },
        };
      },
    });

    const spyGetItem = jest.spyOn(global.localStorage, "getItem").mockReturnValue(null);

    const middleware = generateAuthMiddleWare(options);
    await middleware(REQUEST_NO_SAME_ORIGIN);
    expect(REQUEST_NO_SAME_ORIGIN.headers?.Authorization).toBe(`Bearer ${data.token}`);
    expect(spyGetItem).toHaveBeenCalledTimes(2);
    expect(spySetItem).toHaveBeenCalledTimes(2);
  });
});
