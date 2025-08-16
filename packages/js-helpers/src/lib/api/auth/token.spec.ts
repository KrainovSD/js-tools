import type { AuthMiddleWareOptions } from "../../../types";
import { wait } from "../../utils";
import { getAuthToken } from "./token";

describe("token-request", () => {
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
    expires: 10,
    token: "TOKEN",
  };
  const localStorageInstance: Record<string, unknown> = {
    [options.expiresTokenStorageName]: undefined,
    [options.tokenStorageName]: undefined,
  };
  const spyReplace = jest.fn();

  Object.defineProperty(global, "localStorage", {
    value: {
      setItem: (path: string, value: unknown) => {
        localStorageInstance[path] = value;
      },
    },
  });
  Object.defineProperty(global, "window", {
    value: {
      location: {
        replace: spyReplace,
      },
    },
  });
  const spySetItem = jest.spyOn(global.localStorage, "setItem");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetch error", async () => {
    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: false,
          status: 400,
          json: async () => {
            await wait(0);

            return data;
          },
        };
      },
    });

    await expect(getAuthToken(options)).resolves.toBeNull();
    expect(spyReplace).toHaveBeenCalled();
  });
  it("Bad response data object", async () => {
    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: true,
          status: 200,
          json: async () => {
            await wait(0);

            return [];
          },
        };
      },
    });

    await expect(getAuthToken(options)).resolves.toBeNull();
    expect(spyReplace).toHaveBeenCalled();
  });
  it("Bad response data value", async () => {
    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: true,
          status: 200,
          json: async () => {
            await wait(0);

            return { expires: 10, token: false };
          },
        };
      },
    });

    await expect(getAuthToken(options)).resolves.toBeNull();
    expect(spyReplace).toHaveBeenCalled();
  });
  it("success", async () => {
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

    await expect(getAuthToken(options)).resolves.toBe(data.token);
    expect(spyReplace).not.toHaveBeenCalled();
    expect(spySetItem).toHaveBeenCalledTimes(2);
    expect(localStorageInstance[options.expiresTokenStorageName]).toBe(String(data.expires));
    expect(localStorageInstance[options.tokenStorageName]).toBe(data.token);
  });
});
